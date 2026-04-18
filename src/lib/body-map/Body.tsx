// Vendored from react-muscle-highlighter (MIT, Sorooj Shehryar) and converted
// to TSX. See ./LICENSE for attribution.
//
// MODIFIED from the original:
//  - `userDataMap` is keyed by `${slug}|${side}` (where side is "left",
//    "right", or "common") instead of just `slug`. This allows a caller to
//    paint left and right of the same body part with different colors
//    simultaneously (e.g. left thigh = red for pain, right thigh = blue for
//    swelling). The original force-painted the unmarked side with
//    `defaultFill` whenever a `side` was set on a data entry, which made
//    per-side coloring impossible.
//  - Per-path-side lookup. `commonPaths` look up `${slug}|common`, `leftPaths`
//    look up `${slug}|left`, `rightPaths` look up `${slug}|right`. If no entry
//    is found for a specific (slug, side), the asset's original color is used
//    (we no longer force `defaultFill` on the "other" side).
//  - The `isOnlyRight` / `isOnlyLeft` workaround is removed.
import { useCallback } from 'react';
import type { CSSProperties } from 'react';
import { bodyMaleFront as bodyFront } from './data/bodyMaleFront';
import { bodyMaleBack as bodyBack } from './data/bodyMaleBack';
import { bodyFemaleFront } from './data/bodyFemaleFront';
import { bodyFemaleBack } from './data/bodyFemaleBack';
import { SvgMaleWrapper } from './components/SvgMaleWrapper';
import { SvgFemaleWrapper } from './components/SvgFemaleWrapper';
import type { BodyPart, BodyPartStyles, ExtendedBodyPart, Slug } from './types';

export interface BodyProps {
  /** Intensity colors (used when `intensity` is set on a data entry). */
  colors?: string[];
  /** Per-part overrides. See README; supports `slug`, `side`, `styles.fill`, etc. */
  data: ExtendedBodyPart[];
  /** Scale factor for the SVG. Default 1. */
  scale?: number;
  /** Which body view to render. */
  side?: 'front' | 'back';
  /** Which body asset to render. */
  gender?: 'male' | 'female';
  /** Click handler. `side` is undefined for `common` paths. */
  onBodyPartPress?: (
    bodyPart: ExtendedBodyPart,
    side?: 'left' | 'right'
  ) => void;
  /** Outline color. Pass "none" to disable. */
  border?: string;
  /** Slugs that should render greyed out and ignore clicks. */
  disabledParts?: Slug[];
  /** Slugs that should not render at all. */
  hiddenParts?: Slug[];
  /** Default fill color for unmarked parts. */
  defaultFill?: string;
  /** Default stroke color. */
  defaultStroke?: string;
  /** Default stroke width. */
  defaultStrokeWidth?: number;
}

type SideKey = 'left' | 'right' | 'common';

function makeKey(slug: Slug, side: SideKey): string {
  return `${slug}|${side}`;
}

const Body = ({
  colors = ['#0984e3', '#74b9ff'],
  data,
  scale = 1,
  side = 'front',
  gender = 'male',
  onBodyPartPress,
  border = '#dfdfdf',
  disabledParts = [],
  hiddenParts = [],
  defaultFill = '#3f3f3f',
  defaultStroke = 'none',
  defaultStrokeWidth = 0,
}: BodyProps) => {
  const getPartStyles = useCallback(
    (bodyPart: ExtendedBodyPart): Required<BodyPartStyles> => {
      // Per-part styles override global defaults
      return {
        fill: bodyPart.styles?.fill ?? defaultFill,
        stroke: bodyPart.styles?.stroke ?? defaultStroke,
        strokeWidth: bodyPart.styles?.strokeWidth ?? defaultStrokeWidth,
      };
    },
    [defaultFill, defaultStroke, defaultStrokeWidth]
  );

  // Build a per-(slug, side) lookup map from the user data. Multiple data
  // entries for the same slug with different sides are all preserved.
  // Entries without a `side` are stored under the "common" key.
  const buildUserDataMap = useCallback((): Map<string, ExtendedBodyPart> => {
    const map = new Map<string, ExtendedBodyPart>();
    data.forEach((userPart) => {
      if (!userPart.slug) return;
      const sideKey: SideKey = userPart.side ?? 'common';
      map.set(makeKey(userPart.slug, sideKey), userPart);
    });
    return map;
  }, [data]);

  /**
   * Merge the asset part with the matching user-supplied part for a specific
   * side. Returns the merged ExtendedBodyPart we should render.
   *
   * If the user did not supply data for this (slug, side) combination, the
   * asset part is returned as-is — meaning the asset's own color (or the
   * `defaultFill` from getPartStyles) wins. Critically, we do NOT force
   * `defaultFill` here just because a different side has user data.
   */
  const mergeForSide = useCallback(
    (
      assetPart: BodyPart,
      userDataMap: Map<string, ExtendedBodyPart>,
      sideKey: SideKey
    ): ExtendedBodyPart => {
      if (!assetPart.slug) return assetPart;
      const userPart = userDataMap.get(makeKey(assetPart.slug, sideKey));
      if (!userPart) return assetPart;
      const merged: ExtendedBodyPart = {
        ...assetPart,
        styles: userPart.styles,
        intensity: userPart.intensity,
        side: userPart.side,
        color: userPart.color,
      };
      // Color fallback based on intensity if provided
      if (!merged.styles?.fill && !merged.color && merged.intensity) {
        merged.color = colors[merged.intensity - 1];
      }
      return merged;
    },
    [colors]
  );

  const getColorToFill = (bodyPart: ExtendedBodyPart): string | undefined => {
    if (bodyPart.slug && disabledParts.includes(bodyPart.slug)) {
      return '#EBEBE4';
    }
    // Priority: per-part styles.fill > color prop > intensity-based color > default
    if (bodyPart.styles?.fill) {
      return bodyPart.styles.fill;
    }
    if (bodyPart.color) {
      return bodyPart.color;
    }
    if (bodyPart.intensity && bodyPart.intensity > 0) {
      return colors[bodyPart.intensity - 1];
    }
    return undefined; // Let getPartStyles provide the default
  };

  const isPartDisabled = (slug?: Slug): boolean =>
    !!slug && disabledParts.includes(slug);

  const renderBodySvg = (bodyToRender: BodyPart[]) => {
    const SvgWrapper = gender === 'male' ? SvgMaleWrapper : SvgFemaleWrapper;
    const userDataMap = buildUserDataMap();
    const filteredDataSource = bodyToRender.filter(
      (part) => !part.slug || !hiddenParts.includes(part.slug)
    );

    return (
      <SvgWrapper side={side} scale={scale} border={border}>
        {filteredDataSource.flatMap((assetPart) => {
          const cursorStyle = (slug?: Slug): CSSProperties => ({
            cursor: isPartDisabled(slug) ? 'not-allowed' : 'pointer',
            opacity: isPartDisabled(slug) ? 0.6 : 1,
          });

          const commonPaths = (assetPart.path?.common || []).map(
            (path, index) => {
              const merged = mergeForSide(assetPart, userDataMap, 'common');
              const partStyles = getPartStyles(merged);
              const fillColor = getColorToFill(merged);
              return (
                <path
                  key={`${assetPart.slug}-common-${index}`}
                  onClick={
                    isPartDisabled(assetPart.slug)
                      ? undefined
                      : () => onBodyPartPress?.(merged)
                  }
                  style={cursorStyle(assetPart.slug)}
                  aria-disabled={isPartDisabled(assetPart.slug)}
                  id={assetPart.slug}
                  fill={fillColor ?? partStyles.fill}
                  stroke={partStyles.stroke}
                  strokeWidth={partStyles.strokeWidth}
                  d={path}
                />
              );
            }
          );

          const leftPaths = (assetPart.path?.left || []).map((path, index) => {
            const merged = mergeForSide(assetPart, userDataMap, 'left');
            const partStyles = getPartStyles(merged);
            const fillColor = getColorToFill(merged);
            return (
              <path
                key={`${assetPart.slug}-left-${index}`}
                onClick={
                  isPartDisabled(assetPart.slug)
                    ? undefined
                    : () => onBodyPartPress?.(merged, 'left')
                }
                style={cursorStyle(assetPart.slug)}
                id={assetPart.slug}
                fill={fillColor ?? partStyles.fill}
                stroke={partStyles.stroke}
                strokeWidth={partStyles.strokeWidth}
                d={path}
              />
            );
          });

          const rightPaths = (assetPart.path?.right || []).map(
            (path, index) => {
              const merged = mergeForSide(assetPart, userDataMap, 'right');
              const partStyles = getPartStyles(merged);
              const fillColor = getColorToFill(merged);
              return (
                <path
                  key={`${assetPart.slug}-right-${index}`}
                  onClick={
                    isPartDisabled(assetPart.slug)
                      ? undefined
                      : () => onBodyPartPress?.(merged, 'right')
                  }
                  style={cursorStyle(assetPart.slug)}
                  id={assetPart.slug}
                  fill={fillColor ?? partStyles.fill}
                  stroke={partStyles.stroke}
                  strokeWidth={partStyles.strokeWidth}
                  d={path}
                />
              );
            }
          );

          return [...commonPaths, ...leftPaths, ...rightPaths];
        })}
      </SvgWrapper>
    );
  };

  const bodyToRender =
    gender === 'female'
      ? side === 'front'
        ? bodyFemaleFront
        : bodyFemaleBack
      : side === 'front'
        ? bodyFront
        : bodyBack;

  return renderBodySvg(bodyToRender);
};

export default Body;
