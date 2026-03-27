import { ServiceCategory } from '@/types';

export const servicesExtended: ServiceCategory[] = [
  {
    slug: 'post-surgery-rehabilitation',
    name: 'Post-Surgery Rehabilitation',
    description: 'Comprehensive post-operative rehabilitation to promote healing, restore function, and accelerate recovery after surgery.',
    keywords: ['post-surgery rehabilitation', 'post-operative therapy', 'surgical recovery', 'rehabilitation after surgery', 'Borivali post-surgery'],
    metaDescription: 'Post-surgery rehabilitation in Borivali. Expert physiotherapy for safe, effective surgical recovery.',
    h1: 'Post-Surgery Rehabilitation Services',
    heroDescription: 'Expert post-surgery rehabilitation in Borivali for safe healing, pain management, and complete functional recovery.',
    image: '/images/services/post-surgery-rehabilitation.jpg',
    externalLink: { url: 'https://en.wikipedia.org/wiki/Rehabilitation_(neuropsychology)', text: 'rehabilitation' },
    benefits: [
      {
        title: 'Accelerated Safe Recovery',
        description: 'Structured post-operative rehabilitation promotes optimal healing while preventing complications. Evidence-based protocols progressively restore function safely.',
      },
      {
        title: 'Reduced Complications & Pain',
        description: 'Proper physiotherapy prevents post-surgical complications like blood clots, stiffness, and muscle atrophy. Early mobilization reduces pain and swelling.',
      },
      {
        title: 'Quick Return to Normal Activities',
        description: 'Structured rehabilitation allows faster return to work, exercise, and daily activities. Patients typically return to normal function 2-8 weeks faster than without physiotherapy.',
      },
    ],
    whyPoints: [
      {
        title: 'Post-Surgical Complications Are Serious',
        description: 'Immobility after surgery increases risks of life-threatening complications. Physiotherapy prevents these risks through early, appropriate movement.',
      },
      {
        title: 'Surgeon Expectations Are High for Rehabilitation',
        description: 'Surgeons rely on proper physiotherapy for optimal outcomes. Surgical success depends significantly on post-operative rehabilitation quality.',
      },
      {
        title: 'Surgical Rehabilitation Requires Specialized Knowledge',
        description: 'Post-operative rehabilitation demands understanding surgical precautions, healing phases, and progressive loading protocols. Improper progression risks complications.',
      },
    ],
    faqs: [
      {
        question: 'When should I start physiotherapy after surgery?',
        answer: 'Start timing depends on surgery type and surgeon recommendation. Most patients begin within 24-48 hours post-operatively. We coordinate with your surgeon.',
      },
      {
        question: 'How long do I need post-surgery physiotherapy?',
        answer: 'Duration varies by surgery. Most require 4-12 weeks active rehabilitation. Some need continued home exercises for several months. Progression depends on your individual healing.',
      },
      {
        question: 'What if I have pain during post-surgery rehabilitation?',
        answer: 'Some post-surgical pain is normal. We progress exercises within pain tolerance. Excessive pain requires assessment to rule out complications.',
      },
    ],
    conditions: [
      {
        slug: 'knee-replacement',
        name: 'Knee Replacement Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Knee_replacement', text: 'knee replacement' },
        description: 'Post-operative rehabilitation following knee replacement surgery for restoration of mobility and function.',
        keywords: ['knee replacement rehab', 'total knee replacement recovery', 'knee replacement physiotherapy', 'post-TKR therapy', 'Borivali knee replacement'],
        metaDescription: 'Knee replacement rehabilitation in Borivali. Expert post-surgery therapy for mobility and strength recovery.',
        h1: 'Knee Replacement Rehabilitation & Recovery',
        heroDescription: 'Expert knee replacement rehabilitation in Borivali for safe healing, restored mobility, and complete functional recovery.',
        benefits: [
          {
            title: 'Rapid Mobility & Range of Motion Restoration',
            description: 'Aggressive rehabilitation achieves full knee extension and flexion quickly, preventing stiffness. Most patients regain functional range within 6-8 weeks.',
          },
          {
            title: 'Strength & Functional Independence',
            description: 'Progressive strengthening restores ability to walk, climb stairs, and perform daily activities. Patients typically achieve independence within 8-12 weeks.',
          },
          {
            title: 'Prosthesis Longevity',
            description: 'Proper rehabilitation with strength training protects the prosthesis. Strong muscles reduce stress on the implant, extending its lifespan.',
          },
        ],
        whyPoints: [
          {
            title: 'Post-TKR Stiffness Significantly Impacts Outcomes',
            description: 'Loss of knee motion after replacement severely impacts function and quality of life. Aggressive early mobilization is critical for preventing stiffness.',
          },
          {
            title: 'Strength Training Protects the Replacement',
            description: 'Strong muscles protect the knee replacement from excessive stress and instability. Weakness increases loosening risk and longevity issues.',
          },
          {
            title: 'Rehabilitation Duration Is Significant',
            description: 'Full recovery takes 3-6 months or longer. Consistent home exercises throughout this period are essential for optimal long-term outcomes.',
          },
        ],
        faqs: [
          {
            question: 'How much motion should I have after knee replacement?',
            answer: 'Goal is 0-110 degrees or more. You should achieve full extension immediately and 90-100 degrees flexion within 6 weeks. Aggressive early rehabilitation achieves these targets.',
          },
          {
            question: 'When can I return to walking after knee replacement?',
            answer: 'Most patients walk with crutches or walker immediately post-surgery and progress to independent walking within 4-6 weeks. Timeline depends on strength and healing.',
          },
          {
            question: 'Can I return to sports after knee replacement?',
            answer: 'Yes, many patients return to appropriate activities. Low-impact activities like walking, golf, and swimming are suitable. High-impact sports may not be recommended.',
          },
        ],
      },
      {
        slug: 'hip-replacement',
        name: 'Hip Replacement Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Hip_replacement', text: 'hip replacement' },
        description: 'Post-operative rehabilitation for hip replacement with focus on precautions and functional recovery.',
        keywords: ['hip replacement rehab', 'total hip replacement recovery', 'hip replacement physiotherapy', 'post-THR therapy', 'Borivali hip replacement'],
        metaDescription: 'Hip replacement rehabilitation in Borivali. Expert post-surgery care for mobility and independence recovery.',
        h1: 'Hip Replacement Rehabilitation & Recovery',
        heroDescription: 'Expert hip replacement rehabilitation in Borivali ensuring safe healing, precaution adherence, and functional independence.',
        benefits: [
          {
            title: 'Safe Precaution Adherence',
            description: 'We ensure strict adherence to hip precautions preventing implant dislocation. Proper positioning and movement patterns protect the replacement throughout recovery.',
          },
          {
            title: 'Pain-Free Mobility Restoration',
            description: 'Progressive rehabilitation restores pain-free walking and mobility. Most patients achieve independent walking without assistive devices within 6-8 weeks.',
          },
          {
            title: 'Return to Normal Activities',
            description: 'Full rehabilitation allows return to normal activities and even sports. Most patients resume activity at pre-injury levels within 3-6 months.',
          },
        ],
        whyPoints: [
          {
            title: 'Hip Precautions Are Critical for Success',
            description: 'Dislocation is a serious complication that can damage the replacement. Strict precaution adherence throughout recovery is essential.',
          },
          {
            title: 'Early Mobility Prevents Complications',
            description: 'Early appropriate movement prevents blood clots and stiffness while protecting the replacement. Rapid progression is safe and beneficial.',
          },
          {
            title: 'Hip Replacement Longevity Depends on Rehabilitation',
            description: 'Proper strengthening protects the prosthesis. Strong muscles reduce implant stress and significantly extend prosthesis lifespan.',
          },
        ],
        faqs: [
          {
            question: 'What are hip precautions after replacement?',
            answer: 'Main precautions: avoid hip flexion >90 degrees, avoid hip adduction past midline, avoid internal rotation. These prevent implant dislocation for 6-12 weeks post-surgery.',
          },
          {
            question: 'How long do I need to follow hip precautions?',
            answer: 'Most surgeons recommend precautions for 6-12 weeks. After this period, if healing is progressing well, precautions are typically relaxed. Always follow your surgeon\'s guidance.',
          },
          {
            question: 'When can I resume normal activities after hip replacement?',
            answer: 'Most patients gradually resume normal activities within 6-8 weeks. Full recovery with unrestricted activity typically takes 3-6 months.',
          },
        ],
      },
      {
        slug: 'spine-surgery',
        name: 'Spine Surgery Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Spinal_fusion', text: 'spinal fusion' },
        description: 'Post-operative rehabilitation following spine surgery with specialized protocols.',
        keywords: ['spine surgery rehab', 'spinal fusion recovery', 'spine surgery recovery', 'post-operative spine care', 'Borivali spine surgery'],
        metaDescription: 'Spine surgery rehabilitation in Borivali. Expert post-operative care for safe spinal healing and recovery.',
        h1: 'Spine Surgery Rehabilitation & Recovery',
        heroDescription: 'Expert spine surgery rehabilitation in Borivali for safe healing, pain management, and functional recovery.',
        benefits: [
          {
            title: 'Safe Surgical Healing',
            description: 'We follow strict post-surgical protocols protecting healing tissues. Proper positioning and movement prevent complications affecting surgical fusion or repair.',
          },
          {
            title: 'Pain Management & Swelling Control',
            description: 'Specific techniques manage post-operative pain and swelling. Proper healing is promoted while minimizing medication needs.',
          },
          {
            title: 'Return to Function & Activities',
            description: 'Progressive rehabilitation allows safe return to work, exercise, and daily activities. Most patients resume normal activity within 8-12 weeks.',
          },
        ],
        whyPoints: [
          {
            title: 'Spine Surgery Recovery Is Critical to Success',
            description: 'Surgical success depends significantly on proper post-operative rehabilitation. Inadequate rehabilitation compromises surgical results.',
          },
          {
            title: 'Early Movement Is Essential But Careful',
            description: 'Early appropriate movement prevents stiffness and complications. Progression must respect surgical precautions for successful fusion or repair.',
          },
          {
            title: 'Core Stability Is Essential for Spinal Support',
            description: 'Core strengthening is critical after spine surgery for spinal support and protection. Weak core muscles allow excessive motion and failed fusion risk.',
          },
        ],
        faqs: [
          {
            question: 'When can I start physiotherapy after spine surgery?',
            answer: 'Start timing depends on surgery type (fusion vs. decompression). Generally, gentle therapy begins within days post-operatively. We coordinate with your surgeon.',
          },
          {
            question: 'Can I bend, twist, or lift after spine surgery?',
            answer: 'Restrictions depend on surgery type and surgeon recommendations. Typically, bending and twisting are limited initially to protect healing tissues. Restrictions gradually relax.',
          },
          {
            question: 'How long until I return to work after spine surgery?',
            answer: 'Return timeline depends on work type and surgery extent. Light duty work: 4-6 weeks, normal work: 8-12 weeks. Physical labor requires 3-6 months recovery.',
          },
        ],
      },
      {
        slug: 'fracture-recovery',
        name: 'Fracture Recovery & Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Bone_fracture', text: 'bone fracture' },
        description: 'Rehabilitation for fracture recovery promoting bone healing and functional restoration.',
        keywords: ['fracture rehabilitation', 'fracture recovery', 'post-fracture therapy', 'bone healing', 'Borivali fracture recovery'],
        metaDescription: 'Fracture recovery rehabilitation in Borivali. Expert physiotherapy for bone healing and functional restoration.',
        h1: 'Fracture Recovery & Rehabilitation',
        heroDescription: 'Expert fracture recovery rehabilitation in Borivali promoting safe healing and complete functional restoration.',
        benefits: [
          {
            title: 'Accelerated Bone Healing',
            description: 'Appropriate movement and stress within fracture healing phases promotes optimal bone healing. Early mobilization prevents complications while protecting healing.',
          },
          {
            title: 'Prevented Stiffness & Deconditioning',
            description: 'Gentle early movement prevents joint stiffness and muscle atrophy. Progressive rehabilitation maintains strength throughout healing.',
          },
          {
            title: 'Rapid Functional Return',
            description: 'Early physiotherapy allows faster return to normal activities. Patients typically resume function and activities much faster with proper rehabilitation.',
          },
        ],
        whyPoints: [
          {
            title: 'Immobilization Causes Deconditioning',
            description: 'Complete immobilization during fracture healing causes rapid muscle loss and joint stiffness. Early gentle movement prevents these complications.',
          },
          {
            title: 'Movement Stimulates Bone Healing',
            description: 'Appropriate stress on healing bone stimulates healing. Graded loading through proper progression accelerates fracture healing.',
          },
          {
            title: 'Stiffness Is Difficult to Reverse',
            description: 'Joint stiffness developing during immobilization is difficult to reverse. Prevention through early gentle movement is far easier than treating later stiffness.',
          },
        ],
        faqs: [
          {
            question: 'When can I start moving a fractured bone?',
            answer: 'Joint motion away from fracture site begins immediately if immobilized. Gentle movement of the fractured area begins once X-rays confirm healing. Timing depends on fracture type.',
          },
          {
            question: 'How long until I can bear weight on a fractured leg?',
            answer: 'Weight-bearing timeline depends on fracture location and stability. Most fractures allow partial weight-bearing at 4-6 weeks and full weight-bearing at 8-12 weeks.',
          },
          {
            question: 'How long does fracture rehabilitation take?',
            answer: 'Most fractures require 8-12 weeks for bone healing and initial rehabilitation. Complete functional recovery often takes 3-6 months depending on fracture severity.',
          },
        ],
      },
      {
        slug: 'cardiac-rehab',
        name: 'Cardiac Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Cardiac_rehabilitation', text: 'cardiac rehabilitation' },
        description: 'Safe rehabilitation programs for cardiac patients and post-cardiac surgery recovery.',
        keywords: ['cardiac rehabilitation', 'heart attack recovery', 'post-cardiac surgery', 'cardiac rehab program', 'Borivali cardiac rehab'],
        metaDescription: 'Cardiac rehabilitation in Borivali. Safe recovery programs for heart patients with cardiac training.',
        h1: 'Cardiac Rehabilitation Programs',
        heroDescription: 'Expert cardiac rehabilitation in Borivali for safe recovery with monitored exercise and education programs.',
        benefits: [
          {
            title: 'Safe Progressive Exercise',
            description: 'Monitored exercise programs safely build cardiac fitness while reducing re-infarction risk. Progressive training improves heart function and exercise capacity.',
          },
          {
            title: 'Risk Factor Management & Education',
            description: 'Comprehensive education on lifestyle modifications, diet, stress management, and medication adherence. Risk factor modification prevents recurrent events.',
          },
          {
            title: 'Psychological Support & Return to Normalcy',
            description: 'Support helps overcome post-cardiac event anxiety and depression. Structured rehabilitation promotes confidence and return to normal activities.',
          },
        ],
        whyPoints: [
          {
            title: 'Structured Rehabilitation Reduces Re-Infarction Risk',
            description: 'Cardiac rehabilitation participants have 20-30% lower re-infarction risk. Comprehensive programs reduce mortality and morbidity significantly.',
          },
          {
            title: 'Exercise Improves Cardiac Outcomes',
            description: 'Regular appropriate exercise improves heart function, reduces arrhythmia risk, and improves quality of life post-cardiac event.',
          },
          {
            title: 'Psychological Factors Impact Recovery',
            description: 'Depression and anxiety are common post-cardiac event and worsen outcomes. Comprehensive rehabilitation addresses psychological factors improving overall recovery.',
          },
        ],
        faqs: [
          {
            question: 'Is exercise safe after a heart attack?',
            answer: 'Yes, appropriate exercise is safe and beneficial after heart attack. Monitored cardiac rehabilitation ensures safe progression protecting your heart health.',
          },
          {
            question: 'How long does cardiac rehabilitation take?',
            answer: 'Typical programs are 12 weeks long, with 2-3 sessions weekly. Many patients continue maintenance programs long-term for ongoing benefits.',
          },
          {
            question: 'Can I return to my job after cardiac rehabilitation?',
            answer: 'Most cardiac patients gradually return to work. Timeline depends on job demands and individual recovery. Rehabilitation professionals help guide return-to-work progression.',
          },
        ],
      },
      {
        slug: 'brachial-plexus-surgery',
        name: 'Post-Brachial Plexus Surgery Rehabilitation',
        parentCategory: 'post-surgery-rehabilitation',
        externalLink: { url: 'https://en.wikipedia.org/wiki/Brachial_plexus_injury', text: 'brachial plexus injury' },
        description: 'Specialized rehabilitation following brachial plexus nerve surgery.',
        keywords: ['brachial plexus surgery', 'nerve surgery rehab', 'brachial plexus recovery', 'nerve repair', 'Borivali nerve surgery'],
        metaDescription: 'Brachial plexus surgery rehabilitation in Borivali. Expert post-operative nerve surgery recovery.',
        h1: 'Post-Brachial Plexus Surgery Rehabilitation',
        heroDescription: 'Expert brachial plexus surgery rehabilitation in Borivali for safe nerve healing and function recovery.',
        benefits: [
          {
            title: 'Protected Nerve Healing',
            description: 'We follow strict post-surgical protocols protecting nerve healing. Proper positioning and movement prevent re-injury of healing nerve tissues.',
          },
          {
            title: 'Gradual Strength & Sensation Recovery',
            description: 'Progressive rehabilitation encourages nerve regeneration and muscle reinnervation. Recovery progresses gradually over months as nerves heal.',
          },
          {
            title: 'Optimized Functional Recovery',
            description: 'Structured rehabilitation optimizes nerve recovery potential. Timing and progression significantly impact functional outcomes.',
          },
        ],
        whyPoints: [
          {
            title: 'Nerve Recovery Is Slow and Requires Patience',
            description: 'Nerve healing takes months to years. Consistent rehabilitation throughout this period is essential for optimal recovery.',
          },
          {
            title: 'Early Rehabilitation Prevents Contractures',
            description: 'Early gentle passive movement prevents muscle contractures during nerve regeneration. Prevention is far easier than treating contractures.',
          },
          {
            title: 'Rehabilitation Outcomes Depend on Compliance',
            description: 'Consistent home exercises and treatment compliance directly impact nerve recovery and functional outcomes. Patient commitment is critical.',
          },
        ],
        faqs: [
          {
            question: 'How long until movement returns after brachial plexus surgery?',
            answer: 'Nerve healing is slow, taking 2-3 months for early recovery. Significant functional improvement typically takes 6-12 months or longer.',
          },
          {
            question: 'What can I do while waiting for nerve recovery?',
            answer: 'Gentle passive movement, positioning, and stretching prevent contractures. Early gentle exercises prepare muscles for reinnervation when nerves recover.',
          },
          {
            question: 'Will I regain full function after brachial plexus surgery?',
            answer: 'Functional recovery depends on nerve damage extent and surgical repair success. Some patients achieve near-normal function while others require adaptation.',
          },
        ],
      },
    ],
  },
];
