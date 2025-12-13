import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import QRCode from 'react-qr-code';
import { 
  CreditCard, BookOpen, Shield, Users, Activity, 
  ExternalLink, AlertTriangle, Lock, MapPin, Phone, X, Loader2 
} from './ui/Icons';
import { generateArticleContent } from '../services/geminiService';
import { SecurityTip } from '../types';

// Robust Static List of Guides with PRE-GENERATED CONTENT for instant loading
const STATIC_GUIDES: SecurityTip[] = [
    {
        id: 'g1',
        title: 'Surviving a Kidnap Attempt',
        content: 'Critical protocols for the first 24 hours. How to behave, what to say, and how to signal for help without escalating violence.',
        category: 'Prevention',
        fullContent: `
### The First 24 Hours are Critical

Surviving a kidnap attempt requires a shift in mindset from "victim" to "survivor." Your primary goal is to return home alive.

#### 1. Passive Cooperation
*   **Do not fight** unless you are 100% certain you can escape (e.g., they are unarmed, or you are near safety). In Nigeria, most kidnappers are heavily armed.
*   **Obey immediately:** Follow instructions slowly and show your hands. Do not make sudden moves.
*   **Speak only when spoken to:** Do not be aggressive or overly talkative.

#### 2. Humanize Yourself
*   Quietly mention your family or children if the opportunity arises naturally. It makes it psychologically harder for them to harm you.
*   Avoid making direct eye contact, as this can be seen as a challenge or an attempt to memorize faces.

#### 3. Situational Awareness
*   Memorize sounds, smells, and travel duration. This information helps security forces locate you or helps you navigate if you escape.
*   Note accents or languages spoken.

**Emergency Protocol:** If gunfire erupts (rescue attempt), drop to the floor immediately and stay flat with your hands on your head. Do not run until identified by security forces.
        `
    },
    {
        id: 'g2',
        title: 'Identifying Fake Checkpoints',
        content: 'Distinguish between legitimate Nigerian Army/Police roadblocks and criminal ambushes on highways like Abuja-Kaduna.',
        category: 'Travel',
        fullContent: `
### Is it Police or Bandits?

Criminals often set up illegal checkpoints on highways like Abuja-Kaduna, Lagos-Ibadan, and the East-West road.

#### 1. Appearance and Gear
*   **Uniforms:** Legitimate officers usually have name tags and properly fitted uniforms. Bandits often wear mismatched fatigues or civilian clothes with military vests.
*   **Footwear:** Look at their shoes. Nigerian security forces wear standard-issue boots. Criminals often wear sneakers, sandals, or rain boots.

#### 2. Vehicle Positioning
*   **The Barrier:** Official checkpoints use marked drums or heavy barricades. Illegal ones often use logs, stones, or old tires hastily thrown on the road.
*   **Patrol Cars:** A legitimate checkpoint almost always has a branded patrol vehicle parked nearby. If you see men with guns but no vehicle, reverse immediately if safe.

#### 3. Behavior
*   **Aggression:** Professional officers may be stern, but criminals are often erratic, shouting excessively, or appearing under the influence.
*   **Location:** Be wary of checkpoints situated immediately after sharp bends or in deep valleys (blind spots).

**Action:** If you suspect a fake checkpoint ahead, maintain distance. Do not stop immediately. Assess if you can U-turn. If forced to stop, keep doors locked and windows up until necessary.
        `
    },
    {
        id: 'g3',
        title: 'Cyber Hygiene: Protecting Banking Apps',
        content: 'With phone theft on the rise, learn how to lock your SIM, secure USSD codes, and prevent unauthorized withdrawals.',
        category: 'Cyber',
        fullContent: `
### The "One-Minute" Theft

Thieves in Lagos and Abuja don't just want your phone; they want your bank account. They can empty it in minutes using USSD codes.

#### 1. SIM Card Lock (Critical)
*   Most banking is tied to your SIM. If they move your SIM to another phone, they can receive OTPs.
*   **Action:** Go to your phone settings > Security > Set up SIM card lock. Default pins are often 0000 or 1234. Change this immediately.

#### 2. App Protection
*   Do not use your birthday as your PIN.
*   Enable biometric login (FaceID/Fingerprint) for all finance apps.
*   **Hide Apps:** Use launcher features or folders to hide banking apps from the home screen.

#### 3. Emergency USSD Deactivation
*   Know the "Panic Code" for your bank.
*   *GTBank:* *737*51*10#
*   *Zenith:* *966*911#
*   *UBA:* *919*10#
*   *First Bank:* *894*911#
*   (Check your specific bank for their block code).

**Tip:** Keep a "burner" phone for travel that does not have your primary banking apps installed.
        `
    },
    {
        id: 'g4',
        title: 'First Aid for Gunshot Wounds',
        content: 'Immediate medical steps to stop bleeding and stabilize a victim before professional help arrives.',
        category: 'Emergency',
        fullContent: `
### Stop the Bleed

In security incidents, death from blood loss happens in minutes. You must act fast.

#### 1. Safety First
*   Do not approach the victim if the shooter is still active. Ensure the area is safe.

#### 2. Find the Bleeding
*   Expose the wound. Cut clothing if necessary. Look for exit wounds (often larger than entry wounds).

#### 3. Apply Direct Pressure
*   Use a clean cloth, shirt, or gauze.
*   Push **hard** directly on the wound. Do not stop pushing to "check" if it has stopped.
*   If the wound is deep (e.g., thigh/groin), you may need to pack the wound with the cloth before applying pressure.

#### 4. Tourniquets (Limbs Only)
*   If bleeding is on an arm or leg and doesn't stop with pressure, use a belt or strip of cloth.
*   Tie it **high and tight** (above the wound, closer to the heart).
*   Tighten until the bleeding stops completely. It will be extremely painful for the victim.

**Note:** Do not remove a tourniquet once applied. Mark the time on the victim's forehead if possible.
        `
    },
    {
        id: 'g5',
        title: 'Navigating Civil Unrest',
        content: 'How to safely exit an area during protests or riots in major cities like Lagos or Kano.',
        category: 'Prevention',
        fullContent: `
### Avoiding the Mob

Protests can turn violent rapidly. Being in the wrong place in a vehicle makes you a target.

#### 1. Situational Awareness
*   Monitor Twitter/X and WhatsApp status updates from locals before moving.
*   If you see cars reversing against traffic, do not ask why. Follow them.

#### 2. Vehicle Safety
*   **Keep Moving:** Do not stop to watch. A stationary car is a target.
*   **Remove Valuables:** Hide phones and bags under seats.
*   **Windows Up, Doors Locked.**
*   **Green Branches:** In some regions, attaching green leaves to your wipers signals solidarity or neutrality and may allow safe passage.

#### 3. If Caught in a Crowd
*   **Do not honk.** It aggravates the crowd.
*   **Hands Visible:** Keep hands on the wheel where they can be seen.
*   **Compliance:** If stopped, roll down the window slightly, speak calmly, and agree with their grievances to de-escalate. Hand over cash if demanded to save your life/vehicle.

**Exit Strategy:** Abandon the car if the mob begins smashing windows or attempting to tip it. Run towards police lines or into a secure building (hotel/bank).
        `
    },
    {
        id: 'g6',
        title: 'Home Invasion Defense Strategy',
        content: 'Fortifying your residence and creating a "safe room" plan for your family in case of intruders.',
        category: 'Prevention',
        fullContent: `
### Hardening the Target

Most intruders in Nigeria are opportunistic. Make your home harder to break into than your neighbor's.

#### 1. Perimeter Defense
*   **Lighting:** Motion-sensor floodlights are more effective than constant lights. Sudden light startles intruders.
*   **Vegetation:** Cut back bushes near windows to remove hiding spots.
*   **Generators:** Do not go outside immediately if your generator turns off unexpectedly at night. This is a common ambush tactic.

#### 2. The Safe Room
*   Designate one room (usually the master bedroom) as the safe room.
*   **Door:** Install a solid wood or metal door with a deadbolt, not just a handle lock.
*   **Supplies:** Keep a charged phone, a power bank, and a panic button/alarm remote inside.

#### 3. Family Drill
*   Establish a code word. When spoken, everyone moves to the safe room immediately.
*   Instruct children to hide under the bed or in a closet inside the safe room.

**Action:** If they enter, shout that you have called the police/security. Do not confront them unless you have the means and training to defend yourself.
        `
    },
    {
        id: 'g7',
        title: 'Emergency Communication Tree',
        content: 'Setting up a reliable contact network. Who to call first and how to use offline location sharing.',
        category: 'Emergency',
        fullContent: `
### Who Knows Where You Are?

In an emergency, you may only have seconds to make a call or send a text.

#### 1. The "Proof of Life" Contact
*   Designate one person who knows your daily schedule.
*   Check in at specific times. If you miss a check-in by 1 hour, they initiate protocol.

#### 2. The Communication Tree
*   **Level 1 (Immediate):** Spouse, Parent, or Partner.
*   **Level 2 (Action):** A friend with connections (police, military, or influential community member).
*   **Level 3 (Support):** Lawyer or Doctor.

#### 3. Technology
*   **Live Location:** Share live location on WhatsApp with your trusted contact when embarking on long trips.
*   **Offline Maps:** Download Google Maps for your region so you can navigate if data fails.
*   **Emergency SOS:** Set up your phone's SOS feature (usually pressing the power button 5 times) to dial 112 and text your location to contacts.

**Tip:** Memorize at least two phone numbers. If your phone is taken, you need to be able to call for help from a stranger's phone.
        `
    },
    {
        id: 'g8',
        title: 'Spotting Surveillance',
        content: 'Techniques to know if you are being followed or watched before a potential attack.',
        category: 'Prevention',
        fullContent: `
### Are You Being Followed?

Kidnappings and robberies are rarely random; they are often planned. Spotting the planning phase saves your life.

#### 1. The OODA Loop (Observe, Orient, Decide, Act)
*   **Observe:** Constantly scan your surroundings (360 degrees).
*   **Orient:** Is that car behind me making the same turns?

#### 2. Surveillance Detection Routes (SDR)
*   If you suspect a car is following you, make 3 consecutive left turns (driving in a circle). If they are still there, they are following you.
*   Do not drive home. Drive to the nearest police station or a crowded public place (mall/hospital).

#### 3. Static Surveillance
*   Look for people "loitering" near your gate or office with no clear purpose.
*   Watch for vehicles with engines running but no movement.
*   Be wary of new "vendors" or "hawkers" suddenly appearing on your street.

**Action:** If you suspect surveillance, change your routine. Leave at different times, take different routes. Predictability is your enemy.
        `
    },
    {
        id: 'g9',
        title: 'Social Media OpSec',
        content: 'Why posting your location in real-time makes you a target. Best practices for digital privacy.',
        category: 'Cyber',
        fullContent: `
### Don't Broadcast Your Location

"Post *after* you leave, not *while* you are there."

#### 1. Real-Time Geotagging
*   Posting "Lunch at [Restaurant Name]!" tells kidnappers exactly where you are and that you will likely be there for at least 45 minutes.
*   **Rule:** Post photos after you have safely returned home or moved to a new location.

#### 2. Lifestyle Audits
*   Criminals scour Instagram and TikTok to estimate your net worth.
*   Avoid posting photos that clearly show license plates, house numbers, or expensive jewelry.
*   Be careful with background details (landmarks) that reveal your home address.

#### 3. Travel Plans
*   Never post "Heading to Abuja tomorrow!"
*   This alerts criminals to your route and timeline.

**Privacy Settings:** Set your accounts to "Private" where possible. Audit your followers; remove anyone you do not know personally.
        `
    }
];

const CommunityHub: React.FC = () => {
    // State for Article Reader
    const [selectedGuide, setSelectedGuide] = useState<SecurityTip | null>(null);
    const [articleContent, setArticleContent] = useState<string>('');
    const [loadingArticle, setLoadingArticle] = useState(false);

    const handleReadGuide = async (guide: SecurityTip) => {
        setSelectedGuide(guide);
        
        // CHECK 1: If we have static content (Database Cache Simulation), load instantly
        if (guide.fullContent) {
            setArticleContent(guide.fullContent);
            setLoadingArticle(false); // Ensure loading is false
            return;
        }

        // CHECK 2: If no static content, try to generate it (Fallback)
        setLoadingArticle(true);
        setArticleContent(''); 
        
        try {
            const content = await generateArticleContent(guide.title);
            setArticleContent(content);
        } catch (e) {
            setArticleContent("Unable to load article content. Please check your connection.");
        } finally {
            setLoadingArticle(false);
        }
    };

    const getCategoryIcon = (cat: string) => {
        switch(cat) {
            case 'Cyber': return <Lock className="h-5 w-5" />;
            case 'Travel': return <MapPin className="h-5 w-5" />;
            case 'Emergency': return <Activity className="h-5 w-5" />;
            default: return <Shield className="h-5 w-5" />;
        }
    };

    const getCategoryColor = (cat: string) => {
        switch(cat) {
            case 'Cyber': return 'text-purple-500 bg-purple-500/10';
            case 'Travel': return 'text-blue-500 bg-blue-500/10';
            case 'Emergency': return 'text-red-500 bg-red-500/10';
            default: return 'text-primary bg-primary/10';
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="text-center max-w-2xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4">Community & Education Hub</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Empowering Nigerians with AI-driven safety knowledge. Support our mission to keep the platform open-source and free for everyone.
                </p>
            </div>

            {/* Support Card */}
            <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                 <div className="flex-1">
                     <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold mb-4">
                         OFFICIAL DONATION CHANNEL
                     </div>
                     <h2 className="text-2xl font-bold mb-2">Support the Mission</h2>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                         We accept crypto donations to maintain servers and API costs. All transactions are transparent.
                     </p>
                     
                     <div className="bg-gray-50 dark:bg-dark-900 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
                         <div className="flex items-center justify-between mb-2">
                             <span className="text-xs font-bold text-gray-500">ETH / USDT (ERC-20)</span>
                             <button 
                                onClick={() => navigator.clipboard.writeText('0x0ea47D2fa4b2Aab5eaEd43915AC092f3d603F48c')}
                                className="text-primary text-xs hover:underline"
                             >
                                 Copy
                             </button>
                         </div>
                         <code className="block text-xs md:text-sm font-mono break-all bg-white dark:bg-dark-800 p-2 rounded border border-gray-200 dark:border-dark-700">
                             0x0ea47D2fa4b2Aab5eaEd43915AC092f3d603F48c
                         </code>
                     </div>
                     
                     <div className="flex gap-2 mt-4">
                         {['ETH', 'USDT'].map(c => (
                             <button key={c} className="px-3 py-1 text-xs border border-gray-300 dark:border-dark-600 rounded-lg hover:border-primary hover:text-primary transition-colors">
                                 {c}
                             </button>
                         ))}
                     </div>
                 </div>
                 
                 <div className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg">
                          <QRCode 
                            value="0x0ea47D2fa4b2Aab5eaEd43915AC092f3d603F48c" 
                            size={180}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                          />
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-2 font-mono">Scan to Donate</p>
                 </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                    { label: 'Verified Reports', val: '100+', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Daily Active Users', val: '100+', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Routes Monitored', val: '50+', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-200 dark:border-dark-700 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.val}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Knowledge Base */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Safety Knowledge Base</h2>
                    <div className="text-xs font-medium text-gray-500">
                        {STATIC_GUIDES.length} Guides Available
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STATIC_GUIDES.map((tip) => (
                        <div key={tip.id} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-200 dark:border-dark-700 hover:border-primary/50 transition-colors group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${getCategoryColor(tip.category)}`}>
                                    {getCategoryIcon(tip.category)}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200 dark:border-dark-600 px-2 py-1 rounded-full">
                                    {tip.category}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
                                {tip.content}
                            </p>
                            
                            <button 
                                onClick={() => handleReadGuide(tip)}
                                className="text-xs font-bold text-primary flex items-center group-hover:underline mt-auto"
                            >
                                READ GUIDE <ExternalLink className="h-3 w-3 ml-1" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Article Reader Modal */}
            {selectedGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-dark-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-700 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedGuide.title}</h2>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getCategoryColor(selectedGuide.category)}`}>
                                    {selectedGuide.category}
                                </span>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10">
                            {loadingArticle ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                                    <p className="text-gray-500 animate-pulse">Retrieving comprehensive guide from secure database...</p>
                                </div>
                            ) : (
                                <div className="prose dark:prose-invert max-w-none prose-h3:text-lg prose-h3:font-bold prose-h3:mt-4 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
                                    <ReactMarkdown>
                                        {articleContent}
                                    </ReactMarkdown>
                                    
                                    <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                                        <h4 className="font-bold text-yellow-700 dark:text-yellow-500 flex items-center mb-1">
                                            <AlertTriangle className="h-4 w-4 mr-2" /> Disclaimer
                                        </h4>
                                        <p className="text-xs text-yellow-800 dark:text-yellow-400">
                                            This guide is generated by AI based on security best practices. Always prioritize official instructions from Nigerian security forces in real-time emergencies.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/50 rounded-b-2xl flex justify-end">
                             <button 
                                onClick={() => setSelectedGuide(null)}
                                className="px-6 py-2 bg-gray-200 dark:bg-dark-600 hover:bg-gray-300 dark:hover:bg-dark-500 rounded-lg font-bold text-sm transition-colors"
                             >
                                Close Article
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityHub;