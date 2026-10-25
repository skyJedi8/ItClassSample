export const holidayPackages = [
  {name:'Cozy',feet:'Up to 80 ft',price:549,note:'A simple front roofline'},
  {name:'Classic',feet:'81–110 ft',price:749,note:'A fuller front roofline'},
  {name:'Showcase',feet:'111–150 ft',price:1049,note:'Room for more roofline'},
  {name:'Grand',feet:'151–200 ft',price:1399,note:'A larger roofline design'}
];
export const lightWarranty='Light warranty: we replace burned-out bulbs or strands within 48 hours, all season. Excludes home electrical/GFCI issues, storms/natural disasters, and rodent damage.';
export const ericStory="I'm Eric, an Army veteran, a dad, and the owner of Operation Clean Freedom here in Conroe. Christmas is a time to slow down and enjoy being with family. My girls are why I'm building this business, and I want to help your family enjoy the season too. Let us take care of the lights so you can spend that time together.";
export const holidaySms='sms:+13466236767?&body='+encodeURIComponent("Hi Eric, I'd like a Christmas light price. My address is: ");
export function holidayPhase(now=new Date()):'early'|'install'|'return'|'off'{
  const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  if(date>='2026-10-25'&&date<='2026-11-10')return 'early';
  if(date>'2026-11-10'&&date<='2026-12-10')return 'install';
  if(date>'2026-12-10'&&date<='2027-01-18')return 'return';
  return 'off';
}
export const holidayFaqs=[
 {q:'How much does Christmas light installation cost?',a:'Single-story front-roofline packages are Cozy up to 80 ft $549, Classic 81–110 ft $749, Showcase 111–150 ft $1,049, and Grand 151–200 ft $1,399. Over 200 ft is $7 per foot. All prices plus sales tax. Final scope is measured before quoting.'},
 {q:'Do I keep the lights?',a:'Yes. OCF-supplied custom-cut commercial C9 LED lights, clips and timer are yours to keep. Returning installation is $5.50 per foot, $449 minimum, plus sales tax.'},
 {q:'What is included, and what costs extra?',a:'Packages cover a single-story front roofline, new lights, clips, timer and installation. Second-story runs add $2 per foot with a $100 minimum. Takedown is $99 at booking or $149 if added later, plus sales tax. Trees and bushes need a separate quote.'},
 {q:'What if a bulb or strand goes out?',a:lightWarranty},
 {q:'When do the lights come down?',a:'When takedown is included on your quote, all lights in that purchased scope will be down by January 16, 2027, guaranteed. Removal is not included in installation-only packages. You store your lights between seasons.'},
 {q:'How does booking and payment work?',a:'We confirm measured scope, the total including sales tax and an available installation date first. A received 50% deposit holds that date. The balance is due only when your lights are up and on. A quote request alone does not reserve a slot.'},
 {q:'When and where do you install?',a:'The planned installation season is November 2–December 10 in Conroe, The Woodlands and Spring. Your exact date depends on the confirmed schedule, access and scope.'},
 {q:'Can you install lights I already own?',a:'Yes, subject to checking their condition and fit. Customer-owned installation is $4.50 per foot, $349 minimum, plus sales tax. The OCF-supplied light warranty does not cover customer-owned hardware.'},
 {q:'How are the lights attached?',a:'We use clips sized for the roofline instead of nails, staples or drilled holes. We confirm safe access and attachment points before work.'},
 {q:'Are you insured?',a:'Operation Clean Freedom is veteran-owned and fully insured, with $2 million aggregate general liability coverage.'}
];
