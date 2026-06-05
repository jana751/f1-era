import { useState, useEffect, useRef } from "react";

// ── THEMES ────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#07070f", bg2:"#0d0d1a", surface:"#111120", surface2:"#1a1a2e",
    border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.13)",
    text:"#f0f0f0", text2:"#aaaaaa", muted:"#555555",
    accent:"#e8002d", cardBg:"rgba(255,255,255,0.03)",
    inputBg:"rgba(255,255,255,0.05)", navBg:"rgba(7,7,15,0.93)",
    stripe:"rgba(232,0,45,0.015)",
  },
  light: {
    bg:"#f5f4f0", bg2:"#eeecea", surface:"#ffffff", surface2:"#f0eeea",
    border:"rgba(0,0,0,0.08)", border2:"rgba(0,0,0,0.16)",
    text:"#111111", text2:"#444444", muted:"#999999",
    accent:"#c0112e", cardBg:"rgba(0,0,0,0.02)",
    inputBg:"rgba(0,0,0,0.04)", navBg:"rgba(245,244,240,0.96)",
    stripe:"rgba(192,17,46,0.025)",
  }
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const DAYS=["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAY_FULL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const WEEKLY_SCHEDULE=[
  {day:"MON",type:"LIFT",    label:"Lower Body + Glutes",      color:"#e8002d"},
  {day:"TUE",type:"POOL",    label:"Swimming Intervals",        color:"#00b4d8"},
  {day:"WED",type:"LIFT",    label:"Upper Body + Core",         color:"#e8002d"},
  {day:"THU",type:"RUN",     label:"Run — Outside/Treadmill",   color:"#06d6a0"},
  {day:"FRI",type:"LIFT",    label:"Full Body + Core",          color:"#e8002d"},
  {day:"SAT",type:"RECOVER", label:"Yoga + Stretch + Jacuzzi",  color:"#ffd166"},
  {day:"SUN",type:"RECOVER", label:"Mobility + Weekly Reset",   color:"#ffd166"},
];

const WORKOUTS={
  MON:{title:"Lower Body + Glutes",duration:"60 MIN",type:"GYM · LIFT",rest:"60–75 sec between sets",warmup:"5 min bike or treadmill · 15 bodyweight squats · 20 glute bridges",note:"Hip thrusts and cable kickbacks are your most important exercises. Done consistently for 3 months, these two will visibly transform your glutes.",exercises:[
    {name:"Barbell / Smith Machine Squat",sets:"4",reps:"10–12",rest:"75 sec",muscle:"Glutes + Quads",how:"Feet shoulder-width, toes slightly out. Bar on upper traps (not neck). Brace core, big breath. Push knees out as you lower — thighs parallel or below. Drive through whole foot to stand. Don't let knees cave.",cues:"Chest up · Knees out · Heels down · Breathe at top",common:"Rounding lower back — go lighter and work on depth first."},
    {name:"Hip Thrust (Barbell or Machine)",sets:"4",reps:"12–15",rest:"60 sec",muscle:"Glutes",how:"Upper back on bench, barbell across hips (use foam pad). Feet flat hip-width. Drive hips straight up squeezing glutes hard. Straight line knees to shoulders at top. Hold 2 seconds. Lower in 3 seconds.",cues:"Drive hips UP · 2-sec squeeze · 3-sec lower · Chin tucked",common:"Arching lower back instead of squeezing glutes. Work should be 100% in the glutes."},
    {name:"Romanian Deadlift (Dumbbells)",sets:"3",reps:"10–12",rest:"75 sec",muscle:"Hamstrings + Glutes",how:"Hold dumbbells front of thighs. Hip-width stance, soft knees. Hinge at hips — push bum backwards. Lower until deep hamstring stretch. Drive hips forward to return. Flat back throughout.",cues:"Hinge at hips · Back flat · Feel the stretch · Push floor away",common:"Bending knees too much. This is a HIP HINGE — knees barely move."},
    {name:"Cable Kickback",sets:"3",reps:"15 each",rest:"45 sec",muscle:"Glutes",how:"Ankle strap on low pulley. Face machine, hold frame. Core braced, slight lean. Kick straight leg directly back and up — control it. Squeeze glute hard at peak. Lower in 2 seconds. All reps one leg then switch.",cues:"Controlled kick · Squeeze at top · Don't swing · Slight lean",common:"Using momentum to swing. Slow it down — the glute squeeze at the top is the whole point."},
    {name:"Leg Press (feet high + wide)",sets:"3",reps:"15",rest:"60 sec",muscle:"Glutes + Quads",how:"Feet HIGH on platform, wider than hip-width, toes out. Shifts load to glutes. Lower until 90° — don't let back peel off seat. Press through heels. Don't fully lock out.",cues:"Feet high and wide · Press through heels · Don't lock out · Back flat",common:"Feet too low — turns it into a quad exercise. Move them up."},
    {name:"Walking Lunges (dumbbells)",sets:"3",reps:"12 each",rest:"60 sec",muscle:"Glutes + Quads",how:"Hold dumbbells. Large step forward. Lower back knee toward floor, front shin vertical. Push through front heel to bring back foot forward. Torso upright, core tight.",cues:"Long stride · Front shin vertical · Torso upright · Push through heel",common:"Short stride — puts load on the knee not the glute. Step further."},
    {name:"Cable Pull-Through",sets:"3",reps:"15",rest:"60 sec",muscle:"Glutes + Hamstrings",how:"Rope on low pulley. Stand facing away, straddle cable, hold rope between legs. Step forward for tension. Hinge at hips — push bum back. Feel stretch. Drive hips forward powerfully, squeeze glutes at top.",cues:"Push bum back · Hamstring stretch · Drive hips forward · Squeeze at top",common:"Turning it into a squat. Knees barely move — entirely a hip hinge."},
    {name:"Hanging Knee Raise",sets:"3",reps:"10–15",rest:"60 sec",muscle:"Core + Grip",how:"Hang from pull-up bar shoulder-width. Full hang. Brace core, bring knees to chest. Hold 1 sec at top. Lower in 3 seconds. No swinging. Builds F1 grip strength too.",cues:"Full hang · Knees to chest · Hold at top · 3-sec lower · No swinging",common:"Letting legs drop. Full control every rep."},
  ]},
  TUE:{title:"Pool — Swimming Intervals",duration:"45 MIN",type:"POOL · CARDIO",rest:"See each phase",warmup:"5 min easy swimming any stroke — just get comfortable",note:"Swimming builds shoulder width, burns fat, and builds the cardiovascular endurance F1 demands. 12m pool intervals are more effective than slow laps.",exercises:[
    {name:"Phase 1 (Wk 1–4): Easy Laps",sets:"20–25",reps:"lengths",rest:"20 sec between lengths",muscle:"Full Body Cardio",how:"Swim one length at comfortable pace — breaststroke or freestyle. Rest 20 sec. Repeat. Goal is water comfort and building aerobic base. Don't worry about speed yet.",cues:"Breathe rhythmically · Relax · No gasping · Enjoy it",common:"Going too hard too soon. This phase should feel almost easy."},
    {name:"Phase 2 (Wk 5–10): Intervals",sets:"4–5",reps:"rounds",rest:"30 sec between rounds",muscle:"Cardio + Shoulders",how:"4 lengths hard as possible. Rest 30 sec. 2 lengths easy recovery. Repeat 4–5 rounds. Heart rate 160–170bpm on hard sets. Don't fully stop on easy lengths.",cues:"All-out × 4 · Easy × 2 · Short rest · Repeat",common:"Resting too long. 30 sec and go — incomplete recovery builds fitness."},
    {name:"Phase 3 (Wk 11+): Race Simulation",sets:"20",reps:"min continuous",rest:"No full stops",muscle:"F1 Endurance",how:"Swim 20 min alternating pace every 4 lengths (2 fast, 2 moderate). No full stops. Simulates sustained race-level effort. Follow with 5 × 2-length sprints, 1 easy length between each.",cues:"No full stops · Vary intensity · Maintain rhythm · Count lengths",common:"Stopping at the wall. The no-stop rule is what makes this effective."},
    {name:"Jacuzzi Recovery",sets:"10–15",reps:"min",rest:"—",muscle:"Recovery",how:"Direct jets at glutes, shoulders, upper back, legs. 2–3 min each area. Optional contrast: 2 min cold pool then 2 min jacuzzi × 3 rounds. Reduces inflammation from Monday lifting.",cues:"Jets on worked muscles · Breathe deeply · Cold/hot contrast × 3",common:"Sitting passively. Target the sore areas specifically."},
  ]},
  WED:{title:"Upper Body + Core",duration:"60 MIN",type:"GYM · LIFT",rest:"60 sec between sets",warmup:"5 min light cardio · 15 band pull-aparts · 10 arm circles each direction",note:"Shoulder width creates the V-taper that makes waist look narrower without losing weight. Face pulls EVERY session — this is your posture medicine.",exercises:[
    {name:"Dumbbell Shoulder Press",sets:"4",reps:"10–12",rest:"75 sec",muscle:"Shoulders",how:"Seated or standing, dumbbells at shoulder height, palms forward, elbows 90°. Brace core. Press both straight up until almost fully extended. Lower in 3 seconds. Don't arch lower back.",cues:"Core braced · Press straight up · 3-sec lower · Don't shrug",common:"Arching lower back to press more. Lower the weight and keep ribs down."},
    {name:"Dumbbell Lateral Raise",sets:"4",reps:"15",rest:"45 sec",muscle:"Side Delts",how:"Dumbbells at sides, slight elbow bend. Raise both out to the side — lead with elbows not hands. Stop at shoulder height. Pause 1 sec. Lower in 2 seconds. Go lighter than you think.",cues:"Lead with elbows · Stop at shoulder height · 2-sec lower · No shrugging",common:"Too much weight causing shoulder shrug. If ears rise, go lighter."},
    {name:"Cable Face Pull",sets:"4",reps:"15–20",rest:"45 sec",muscle:"Neck + Posture",how:"Cable at forehead height, rope attachment. Overhand grip. Pull rope toward face — elbows flare OUT and HIGH, hands to either side of head. Squeeze shoulder blades together. Hold 1 sec. Return slowly.",cues:"Elbows flare wide and HIGH · Pull to face · Squeeze blades · Slow return",common:"Pulling too low to the chest — loses the rear delt benefit entirely."},
    {name:"Lat Pulldown",sets:"4",reps:"10–12",rest:"75 sec",muscle:"Back + Width",how:"Wider than shoulder grip, overhand. Thighs under pad. Lean back 15°. Pull to upper chest — lead with elbows toward back pockets. Squeeze lats at bottom. Return in 3 seconds. No swinging.",cues:"Lead with elbows · Bar to upper chest · Lean slightly · 3-sec return",common:"Pulling bar behind neck — stresses spine. Always pull to the chest."},
    {name:"Seated Cable Row",sets:"3",reps:"12",rest:"60 sec",muscle:"Mid-Back + Posture",how:"Feet on platform, slight knee bend. Sit tall — proud chest. Pull handle to stomach, elbows back past body. Squeeze shoulder blades. Hold 1 sec. Return fully extended.",cues:"Sit tall · Pull elbows back · Squeeze blades · Slow return · Full stretch",common:"Rounding back on the way out. Keep chest proud throughout."},
    {name:"Dumbbell Bicep Curl",sets:"3",reps:"12",rest:"45 sec",muscle:"Arms",how:"Dumbbells at sides, palms forward. Elbows pinned to sides — they must not move. Curl to shoulders. Squeeze at top. Lower in 3 seconds, fully extend. No swinging.",cues:"Elbows stay back · Squeeze at top · 3-sec lower · No swinging",common:"Swinging body to curl heavier. Go lighter and do strict reps."},
    {name:"Tricep Cable Pushdown",sets:"3",reps:"15",rest:"45 sec",muscle:"Arms",how:"High cable, rope or bar. Elbows tucked to sides. Push down until arms fully straight, spread rope at bottom. Squeeze triceps. Return slowly. Upper arms stay still. Triceps = 2/3 of arm size.",cues:"Elbows at sides · Full extension · Spread rope · Slow return",common:"Flaring elbows out. They must stay glued to your sides."},
    {name:"Cable Woodchop (high to low)",sets:"3",reps:"12 each",rest:"45 sec",muscle:"Obliques + Core",how:"High cable, stand sideways. Both hands on handle. Rotate torso, pulling cable diagonally down toward opposite hip. Back foot pivots. Return with control. F1 rotational core stability.",cues:"Rotate from torso · Back foot pivots · Control return · Both sides equal",common:"Pulling with arms only. Movement comes from rotating entire torso."},
    {name:"Ab Wheel Rollout",sets:"3",reps:"8–12",rest:"60 sec",muscle:"Core",how:"Kneel on floor, hands on wheel below shoulders. Brace core HARD. Roll forward slowly, back flat. Go only as far as you can control. Roll back using core not hips.",cues:"Core braced tight · Flat back · Only as far as you can control · Pull back with abs",common:"Lower back sagging — reduce range until stronger."},
  ]},
  THU:{title:"Run Session",duration:"30–55 MIN",type:"CARDIO · OUTSIDE OR TREADMILL",rest:"Walk intervals = the rest",warmup:"5 min brisk walk · 10 leg swings each leg · 10 hip circles",note:"Alternate each week — outside for sun and natural tan, treadmill for pace control. Always 1% incline on treadmill.",exercises:[
    {name:"Phase 1 (Wk 1–4): Run/Walk Intervals",sets:"8",reps:"rounds",rest:"Walk 2 min between runs",muscle:"Cardio Base",how:"Run 1 min at easy jog — able to say a few words. Walk briskly 2 min. Repeat × 8. Cool-down walk 5 min. Treadmill: 8–9 km/h run, 6 km/h walk, 1% incline.",cues:"Easy jog · Breathe through nose · Brisk walk recovery",common:"Running too fast. If you can't speak at all, slow down."},
    {name:"Phase 2 (Wk 5–10): Zone 2 Continuous",sets:"1",reps:"continuous",rest:"No stops",muscle:"F1 Endurance",how:"Run continuously at conversational pace — full sentences, mild effort. Zone 2 = 120–140bpm. Start 25 min, add 5 min every 2 weeks to reach 35 min. Treadmill: 9–10 km/h.",cues:"Conversational pace · Steady rhythm · Nose breathing when possible",common:"Going too fast and gasping. Almost too easy is exactly right for Zone 2."},
    {name:"Phase 3 (Wk 11+): Tempo + Sprints",sets:"10+20+5",reps:"min structure",rest:"90 sec between sprints",muscle:"Race Fitness",how:"10 min easy jog. 20 min tempo (hard, single words only, 150–165bpm). 5 × 1 min all-out sprints with 90 sec easy jog between. 10 min easy cool-down.",cues:"Easy → Tempo → Sprint → Recover · 170–185bpm on sprints",common:"Skipping warm-up before hard effort — this is how injuries happen."},
    {name:"Cool-Down + Stretch",sets:"10",reps:"min",rest:"—",muscle:"Recovery",how:"Walk 5 min slowly. Then: calf stretch 45 sec each, hip flexor lunge 45 sec each, hamstring stretch 45 sec each. Never skip on run days.",cues:"Walk first · Hip flexors are priority · Hold each 45 sec",common:"Stopping immediately and sitting. Walk 5 min first to let heart rate come down."},
  ]},
  FRI:{title:"Full Body + Core",duration:"60 MIN",type:"GYM · LIFT",rest:"45–60 sec (shorter keeps heart rate elevated)",warmup:"5 min cardio · 10 hip hinges · 10 push-ups · 10 band pull-aparts",note:"Compound movements with short rest. Heart rate stays elevated — burns fat while building strength. Friday is closest to F1 race conditions.",exercises:[
    {name:"Deadlift (Barbell or Dumbbell)",sets:"4",reps:"8",rest:"90 sec",muscle:"Full Body",how:"Bar over mid-foot, feet hip-width. Grip just outside legs. Shoulders over bar, flat back. Big breath, brace hard. PUSH THE FLOOR AWAY — don't think pull up. Keep bar close to legs. Lock out at top with hips forward and glutes squeezed.",cues:"Bar close to legs · Push floor away · Flat back · Lock out at top",common:"Rounding lower back. Lower the weight immediately — this causes injury."},
    {name:"Dumbbell Squat to Press",sets:"3",reps:"12",rest:"60 sec",muscle:"Full Body",how:"Dumbbells at shoulder height. Squat until thighs parallel. As you drive up use that momentum to press dumbbells overhead in one fluid movement. Lower both together. Maximum calorie burn.",cues:"Squat then press in one flow · Full squat depth · Full press overhead",common:"Partial squat. Go all the way — the full squat power makes the press easier."},
    {name:"Push-Up",sets:"3",reps:"Max reps",rest:"60 sec",muscle:"Chest + Arms + Core",how:"Hands slightly wider than shoulders, straight line head to heels. Lower chest to floor, elbows at 45°. Push back up. Every rep must touch floor. If 15+ is easy, add a weight plate on back. If too hard, hands on a bench.",cues:"Chest to floor · Elbows at 45° · Straight body line · Full range only",common:"Half reps. Fewer full reps beats more half reps every time."},
    {name:"Single-Leg Romanian Deadlift",sets:"3",reps:"10 each",rest:"60 sec",muscle:"Glutes + Balance",how:"One dumbbell in right hand. Stand on left leg, soft knee bend. Hinge at hip — torso goes forward as right leg lifts as counterweight. Lower dumbbell toward floor. Feel glute stretch. Drive hip forward to return. Start very light.",cues:"Hinge from hip · Back leg lifts · Feel stretch · Drive hip forward",common:"Losing balance turning it into a lunge. Fix point on floor and slow down."},
    {name:"Cable Lateral Raise",sets:"3",reps:"15 each",rest:"45 sec",muscle:"Shoulders",how:"Low cable, stand sideways. Hold handle with far hand crossing in front. Raise arm out to shoulder height. Lower in 2 seconds. Constant cable tension = more effective than dumbbells for shoulder width.",cues:"Cross in front to start · Raise to shoulder height · 2-sec lower · Don't shrug",common:"Raising above shoulder level — stresses the AC joint. Stop at shoulder height."},
    {name:"Pull-Up / Assisted Pull-Up",sets:"3",reps:"Max or 8 assisted",rest:"90 sec",muscle:"Back + Width",how:"Slightly wider than shoulders, overhand. Full hang. Pull chest toward bar by driving elbows down toward hips. Chin clears bar. Lower in 3 seconds. Use assisted machine if needed.",cues:"Drive elbows down · Chest to bar · 3-sec lower · Full hang at bottom",common:"Not going all the way down. Half pull-ups don't build full back strength."},
    {name:"Hanging Leg Raise",sets:"3",reps:"10–12",rest:"60 sec",muscle:"Core — F1",how:"Hang from bar. Core completely braced. Raise straight legs to parallel or higher. Hold 1 sec. Lower in 3 seconds. Never drop legs. Bend knees if too hard.",cues:"Legs straight · Hold at top · 3-sec lower · No swinging",common:"Swinging legs with momentum. Full dead-stop at bottom of each rep."},
    {name:"Cable Pallof Press",sets:"3",reps:"12 each",rest:"45 sec",muscle:"Core — F1",how:"Cable at chest height, stand sideways. Both hands on handle at chest. Step out for tension. BRACE — cable is trying to rotate you, resist it. Press straight out, hold 2 sec, return. Never let it rotate you.",cues:"Resist the rotation · Press straight out · Hold 2 sec · Core braced entire time",common:"Letting body rotate toward cable. Engage harder — anti-rotation is the whole exercise."},
  ]},
  SAT:{title:"Yoga + Deep Stretch + Jacuzzi",duration:"50 MIN",type:"RECOVERY · GYM",rest:"Hold each stretch for full time",warmup:"5 min easy walk to warm body before stretching",note:"Recovery is where muscles repair and grow stronger. The jacuzzi is a training tool. Never skip Saturday.",exercises:[
    {name:"Cat-Cow + Thoracic Rotation",sets:"3",reps:"min",rest:"—",muscle:"Spine Mobility",how:"Hands and knees. Cat: round back up, tuck chin and pelvis. Cow: drop belly, lift chest and tailbone. Slow, 3 sec each. Then thread the needle: slide arm under body, rotate torso. Hold 20 sec each side × 3.",cues:"Slow breathing · Feel each spinal segment · Don't rush",common:"Moving too fast. Should be slow and breath-linked."},
    {name:"Pigeon Pose — both sides",sets:"90 sec",reps:"each side",rest:"30 sec between",muscle:"Hip + Glutes",how:"From all fours, right knee to right wrist, left leg straight back. Lower hips (use towel if needed). Fold torso forward. Breathe into tightness. 90 sec each side minimum.",cues:"Hips square · Breathe into tightness · Don't force it · 90 sec minimum",common:"Holding only 20–30 sec. Connective tissue needs 60–90 sec to actually release."},
    {name:"Hip Flexor Lunge Stretch",sets:"60 sec",reps:"each side",rest:"20 sec",muscle:"Posture Fix",how:"Kneel on right knee, left foot forward. Push hips gently forward and down — deep stretch at front of right hip. Torso upright. Deeper: raise right arm overhead and lean left slightly.",cues:"Hips forward and down · Torso upright · Feel front hip · Breathe deeply",common:"Leaning torso forward — this releases the stretch. Stay upright."},
    {name:"Doorway Chest Opener",sets:"3",reps:"× 45 sec",rest:"15 sec",muscle:"Posture Fix",how:"Forearms on doorframe in goalpost position (elbows at 90°). Step forward, gently lean through doorway. Feel stretch across chest and front of shoulders. Each exhale lean slightly further.",cues:"Elbows at 90° · Lean forward gently · Breathe into it · Chest opens",common:"Arms too high. Keep elbows at shoulder height for maximum chest stretch."},
    {name:"Yoga Flow (YouTube 20 min)",sets:"20",reps:"min",rest:"—",muscle:"Full Body Mobility",how:"YouTube: 'Yoga with Adriene athletes 20 minutes'. Free and excellent. Covers all the poses you need. Just follow along and breathe. You don't need to be good at yoga.",cues:"Follow along · Breathe into every position · Don't force range",common:"Skipping because it feels unnecessary. Flexibility prevents injury — as important as lifting."},
    {name:"Jacuzzi — Active Recovery",sets:"10–15",reps:"min",rest:"—",muscle:"Recovery",how:"Jets at glutes, hamstrings, lower and upper back. 2–3 min each. Optional: 2 min cold pool, 2 min jacuzzi × 3. Contrast therapy flushes inflammation — used by every elite endurance athlete.",cues:"Jets on worked muscles · Breathe · Cold/hot contrast × 3",common:"Sitting passively. Target sore areas specifically."},
  ]},
  SUN:{title:"Mobility + Weekly Reset",duration:"35 MIN",type:"RECOVERY · HOME",rest:"Rest day — no training pressure",warmup:"No warm-up needed",note:"Sunday is the engine room of the week. 90 min total. The people who transform are boring about it — they always show up.",exercises:[
    {name:"Foam Roll — Full Body",sets:"12–15",reps:"min",rest:"—",muscle:"Recovery",how:"Slow through each area, 60–90 sec each: calves, hamstrings, glutes, upper back (most important), lats, quads. Pause on tight spots for 20 sec. Upper back foam rolling is the single best thing for posture.",cues:"Slow rolls · Pause on tight spots · Breathe into it · Upper back is priority",common:"Rolling too fast. Speed does nothing. Find the knots and sit on them."},
    {name:"Morning Posture Protocol",sets:"15",reps:"min",rest:"—",muscle:"Posture — Every Day",how:"Every day including Sunday. Chin tucks: pull chin back, hold 5 sec × 15. Wall angels: back on wall, arms goalpost, slide overhead × 10. Band pull-aparts × 20. Hip flexor stretch 45 sec each. Posture stand 60 sec.",cues:"Every. Single. Day. Without exception.",common:"Skipping weekends. Posture fixes through daily practice only."},
    {name:"Weekly Review + Planning",sets:"15",reps:"min",rest:"—",muscle:"Mind",how:"Write it down. Three things proud of. Three things to improve. Check habit tracker. Progress photo same spot same light. Review workout weights. Plan heavier lifts for next week. Read F1 goal statement aloud.",cues:"Write it down · Progress photo · Review weights · Set intention",common:"Just thinking instead of writing. Writing makes it real."},
    {name:"Sunday Meal Prep",sets:"45–60",reps:"min",rest:"—",muscle:"Nutrition",how:"Cook everything simultaneously: eggs boiling (10 min), rice in pot (20 min), lentils on stove (25 min), veg roasting at 200°C (25 min). While waiting: wash salad, portion tuna. Store in clear containers, label by day.",cues:"Everything at once · Clear containers · Label by day",common:"Planning to cook each day. You won't after hard sessions. Prep Sunday, eat well all week."},
  ]},
};

const HABITS=[
  {id:"wake_light",  cat:"morning",icon:"☀", label:"Open curtains — natural light immediately"},
  {id:"water_am",   cat:"morning",icon:"💧",label:"Full glass of water on waking"},
  {id:"no_phone",   cat:"morning",icon:"📵",label:"No phone for first 60 minutes"},
  {id:"dead_hang",  cat:"morning",icon:"⬆", label:"Dead hang — 3 sets on bar"},
  {id:"posture_r",  cat:"morning",icon:"⟁", label:"Morning posture protocol (15 min)"},
  {id:"jaw",        cat:"morning",icon:"◆", label:"Jaw work + mewing practice"},
  {id:"fajr",       cat:"deen",   icon:"☽", label:"Fajr ✦"},
  {id:"quran",      cat:"deen",   icon:"◈", label:"Quran after Fajr (10–15 min)"},
  {id:"hifz",       cat:"deen",   icon:"◉", label:"Memorise / revise 1 ayah"},
  {id:"dhuhr",      cat:"deen",   icon:"☽", label:"Dhuhr ✦"},
  {id:"asr",        cat:"deen",   icon:"☽", label:"Asr ✦"},
  {id:"maghrib",    cat:"deen",   icon:"☽", label:"Maghrib ✦"},
  {id:"isha",       cat:"deen",   icon:"☽", label:"Isha ✦"},
  {id:"dhikr",      cat:"deen",   icon:"◈", label:"Evening dhikr before sleep"},
  {id:"workout",    cat:"body",   icon:"⚡", label:"Complete today's training session"},
  {id:"walk",       cat:"body",   icon:"▶", label:"Daily walk (20–30 min)"},
  {id:"chin_tucks", cat:"body",   icon:"⟁", label:"Chin tucks throughout the day"},
  {id:"posture_d",  cat:"body",   icon:"▲", label:"Conscious upright posture all day"},
  {id:"skin_am",    cat:"glow",   icon:"✦", label:"AM skincare — cleanser + niacinamide + SPF"},
  {id:"skin_pm",    cat:"glow",   icon:"✦", label:"PM skincare — cleanser + retinol + moisturiser"},
  {id:"no_face",    cat:"glow",   icon:"✗", label:"Didn't touch face with unwashed hands"},
  {id:"hair",       cat:"glow",   icon:"✿", label:"Hair routine (wash/refresh + scalp massage)"},
  {id:"protein",    cat:"food",   icon:"◉", label:"Hit protein target (~100g)"},
  {id:"water",      cat:"food",   icon:"💧",label:"2.5L+ water"},
  {id:"no_sugar",   cat:"food",   icon:"✗", label:"Avoided sugar + ultra-processed food"},
  {id:"stop_eat",   cat:"food",   icon:"◆", label:"Stopped eating 2–3 hrs before bed"},
  {id:"deep_work",  cat:"mind",   icon:"◈", label:"Deep work block #1 (90 min)"},
  {id:"tasks",      cat:"mind",   icon:"▶", label:"3 Most Important Tasks completed"},
  {id:"viz",        cat:"mind",   icon:"✦", label:"Visualisation — 5 min F1 goal"},
  {id:"journal",    cat:"mind",   icon:"◉", label:"Journalled — wins + tomorrow"},
  {id:"sleep",      cat:"mind",   icon:"☽", label:"In bed by 10:30pm for 8hrs sleep"},
];

const CAT_META={
  morning:{label:"Morning Ritual",     color:"#ffd166"},
  deen:   {label:"Salah + Quran",      color:"#06d6a0"},
  body:   {label:"Training + Body",    color:"#e8002d"},
  glow:   {label:"Skin + Hair + Glow", color:"#f4a261"},
  food:   {label:"Nutrition",          color:"#00b4d8"},
  mind:   {label:"Mind + Productivity",color:"#a78bfa"},
};

const JUZ_AMMA=[
  {id:"naba",    num:78, name:"An-Naba",      arabic:"النبأ",    verses:40},
  {id:"naziat",  num:79, name:"An-Nazi'at",   arabic:"النازعات", verses:46},
  {id:"abasa",   num:80, name:"Abasa",        arabic:"عبس",      verses:42},
  {id:"takwir",  num:81, name:"At-Takwir",    arabic:"التكوير",  verses:29},
  {id:"infitar", num:82, name:"Al-Infitar",   arabic:"الإنفطار", verses:19},
  {id:"mutaffif",num:83, name:"Al-Mutaffifin",arabic:"المطففين", verses:36},
  {id:"inshiqaq",num:84, name:"Al-Inshiqaq",  arabic:"الإنشقاق", verses:25},
  {id:"buruj",   num:85, name:"Al-Buruj",     arabic:"البروج",   verses:22},
  {id:"tariq",   num:86, name:"At-Tariq",     arabic:"الطارق",   verses:17},
  {id:"ala",     num:87, name:"Al-A'la",      arabic:"الأعلى",   verses:19},
  {id:"ghashiya",num:88, name:"Al-Ghashiyah", arabic:"الغاشية",  verses:26},
  {id:"fajr",    num:89, name:"Al-Fajr",      arabic:"الفجر",    verses:30},
  {id:"balad",   num:90, name:"Al-Balad",     arabic:"البلد",    verses:20},
  {id:"shams",   num:91, name:"Ash-Shams",    arabic:"الشمس",    verses:15},
  {id:"layl",    num:92, name:"Al-Layl",      arabic:"الليل",    verses:21},
  {id:"duha",    num:93, name:"Ad-Duha",      arabic:"الضحى",    verses:11},
  {id:"sharh",   num:94, name:"Ash-Sharh",    arabic:"الشرح",    verses:8},
  {id:"tin",     num:95, name:"At-Tin",       arabic:"التين",    verses:8},
  {id:"alaq",    num:96, name:"Al-Alaq",      arabic:"العلق",    verses:19},
  {id:"qadr",    num:97, name:"Al-Qadr",      arabic:"القدر",    verses:5},
  {id:"bayyina", num:98, name:"Al-Bayyinah",  arabic:"البينة",   verses:8},
  {id:"zalzala", num:99, name:"Az-Zalzalah",  arabic:"الزلزلة",  verses:8},
  {id:"adiyat",  num:100,name:"Al-Adiyat",    arabic:"العاديات", verses:11},
  {id:"qaria",   num:101,name:"Al-Qari'ah",   arabic:"القارعة",  verses:11},
  {id:"takathur",num:102,name:"At-Takathur",  arabic:"التكاثر",  verses:8},
  {id:"asr",     num:103,name:"Al-Asr",       arabic:"العصر",    verses:3},
  {id:"humaza",  num:104,name:"Al-Humazah",   arabic:"الهمزة",   verses:9},
  {id:"fil",     num:105,name:"Al-Fil",       arabic:"الفيل",    verses:5},
  {id:"quraysh", num:106,name:"Quraysh",      arabic:"قريش",     verses:4},
  {id:"maun",    num:107,name:"Al-Ma'un",     arabic:"الماعون",  verses:7},
  {id:"kawthar", num:108,name:"Al-Kawthar",   arabic:"الكوثر",   verses:3},
  {id:"kafirun", num:109,name:"Al-Kafirun",   arabic:"الكافرون", verses:6},
  {id:"nasr",    num:110,name:"An-Nasr",      arabic:"النصر",    verses:3},
  {id:"masad",   num:111,name:"Al-Masad",     arabic:"المسد",    verses:5},
  {id:"ikhlas",  num:112,name:"Al-Ikhlas",    arabic:"الإخلاص",  verses:4},
  {id:"falaq",   num:113,name:"Al-Falaq",     arabic:"الفلق",    verses:5},
  {id:"nas",     num:114,name:"An-Nas",       arabic:"الناس",    verses:6},
];

const MEASUREMENTS_LABELS=[
  {key:"weight",   label:"Weight",        short:"WT",  unit:"kg"},
  {key:"waist",    label:"Waist",         short:"WST", unit:"cm"},
  {key:"hips",     label:"Hips/Glutes",   short:"HPS", unit:"cm"},
  {key:"shoulders",label:"Shoulders",     short:"SHL", unit:"cm"},
  {key:"chest",    label:"Chest",         short:"CHT", unit:"cm"},
  {key:"leftarm",  label:"Left Arm",      short:"L.ARM",unit:"cm"},
  {key:"rightarm", label:"Right Arm",     short:"R.ARM",unit:"cm"},
];

// ── STORAGE + UTILS ───────────────────────────────────────────────────────────
const todayKey=()=>new Date().toISOString().slice(0,10);
const ls={
  get:(k,def={})=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch{return def;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
};
function getStreak(){
  let streak=0;const today=new Date();
  for(let i=0;i<365;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const k=d.toISOString().slice(0,10);
    const raw=localStorage.getItem("f1_tracker_"+k);
    if(!raw){if(i===0)continue;break;}
    const s=JSON.parse(raw);const done=HABITS.filter(h=>s.checked?.[h.id]).length;
    if(done>0)streak++;else if(i>0)break;
  }
  return streak;
}
function loadHistory(){
  const out=[];const today=new Date();
  for(let i=1;i<=30;i++){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().slice(0,10);
    const raw=localStorage.getItem("f1_tracker_"+key);
    if(raw)out.push({date:key,d,...JSON.parse(raw)});
  }
  return out;
}
function fmt(s){const m=Math.floor(s/60),r=s%60;return `${m}:${r<10?"0":""}${r}`;}

// ── TIMER HOOK ────────────────────────────────────────────────────────────────
function useTimer(){
  const [secs,setSecs]=useState(0);
  const [running,setRunning]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(running&&secs>0){ref.current=setInterval(()=>setSecs(s=>s-1),1000);}
    else if(secs===0){setRunning(false);clearInterval(ref.current);}
    return()=>clearInterval(ref.current);
  },[running,secs]);
  const start=(s)=>{setSecs(s);setRunning(true);};
  const stop=()=>{setRunning(false);clearInterval(ref.current);};
  const reset=()=>{stop();setSecs(0);};
  return{secs,running,start,stop,reset};
}

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
function Badge({children,color="#e8002d"}){
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:3,padding:"2px 8px",fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}
function SectionHeader({num,title,t}){
  return(
    <div style={{display:"flex",alignItems:"baseline",gap:"1rem",marginBottom:"2rem",paddingBottom:"0.75rem",borderBottom:`1px solid ${t.accent}22`}}>
      <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"0.7rem",fontWeight:700,color:t.accent,letterSpacing:"0.25em"}}>{num}</span>
      <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.03em",color:t.text}}>{title}</h2>
    </div>
  );
}
function NoteBox({children,t}){
  return <div style={{background:t.accent+"0d",border:`1px solid ${t.accent}22`,borderLeft:`3px solid ${t.accent}`,borderRadius:"0 6px 6px 0",padding:"0.85rem 1.1rem",margin:"1.2rem 0",fontSize:"0.65rem",color:t.text2,lineHeight:1.7}}>{children}</div>;
}

// ── REST TIMER ────────────────────────────────────────────────────────────────
function RestTimer({t}){
  const timer=useTimer();
  const presets=[30,45,60,75,90,120];
  const pct=timer.secs>0?(timer.secs/120)*100:0;
  return(
    <div style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1rem"}}>
      <div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:t.accent,textTransform:"uppercase",marginBottom:"0.6rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>// REST TIMER //</div>
      <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
        <div style={{position:"relative",width:56,height:56,flexShrink:0}}>
          <svg width="56" height="56" style={{transform:"rotate(-90deg)"}}>
            <circle cx="28" cy="28" r="24" fill="none" stroke={t.border2} strokeWidth="3"/>
            <circle cx="28" cy="28" r="24" fill="none" stroke={timer.secs<=10&&timer.secs>0?"#e8002d":t.accent} strokeWidth="3"
              strokeDasharray={`${2*Math.PI*24}`} strokeDashoffset={`${2*Math.PI*24*(1-pct/100)}`}
              style={{transition:"stroke-dashoffset 1s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:"0.75rem",fontWeight:700,color:timer.secs<=10&&timer.secs>0?"#e8002d":t.text}}>{timer.secs>0?fmt(timer.secs):"—"}</div>
        </div>
        <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
          {presets.map(s=>(
            <button key={s} onClick={()=>timer.start(s)}
              style={{padding:"0.3rem 0.6rem",background:t.accent+"15",border:`1px solid ${t.accent}44`,borderRadius:4,color:t.accent,cursor:"pointer",fontSize:"0.62rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background=t.accent+"30"}
              onMouseLeave={e=>e.currentTarget.style.background=t.accent+"15"}>
              {s}s
            </button>
          ))}
          {timer.secs>0&&<button onClick={timer.reset} style={{padding:"0.3rem 0.6rem",background:t.surface,border:`1px solid ${t.border}`,borderRadius:4,color:t.muted,cursor:"pointer",fontSize:"0.62rem"}}>✕</button>}
        </div>
      </div>
    </div>
  );
}

// ── EXERCISE CARD ─────────────────────────────────────────────────────────────
function ExerciseCard({ex,idx,color,checked,onCheck,dayKey,t}){
  const [open,setOpen]=useState(false);
  const isDone=checked[`${dayKey}_${idx}`];
  const numSets=parseInt(ex.sets)||3;
  return(
    <div style={{background:isDone?t.cardBg:t.surface,border:`1px solid ${isDone?t.border:t.border2}`,borderLeft:`3px solid ${isDone?t.muted:color}`,borderRadius:6,overflow:"hidden",transition:"all 0.2s",opacity:isDone?0.5:1,marginBottom:"0.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.9rem 1rem",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div onClick={e=>{e.stopPropagation();onCheck(`${dayKey}_${idx}`);}}
          style={{width:22,height:22,borderRadius:5,flexShrink:0,cursor:"pointer",background:isDone?color:"transparent",border:`2px solid ${isDone?color:t.border2}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
          {isDone&&<span style={{fontSize:"0.7rem",color:"#000",fontWeight:900,lineHeight:1}}>✓</span>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:"0.75rem",color:isDone?t.muted:t.text,fontWeight:500,textDecoration:isDone?"line-through":"none",marginBottom:"0.15rem"}}>{ex.name}</div>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
            <span style={{fontSize:"0.6rem",color:color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>{ex.sets} sets × {ex.reps}</span>
            <span style={{fontSize:"0.55rem",color:t.muted}}>· Rest: {ex.rest}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"center",flexShrink:0}}>
          <Badge color={color}>{ex.muscle}</Badge>
          <span style={{fontSize:"0.75rem",color:t.muted,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)",display:"block"}}>▾</span>
        </div>
      </div>
      {open&&(
        <div style={{padding:"0 1rem 1rem 3.2rem",animation:"fadeUp 0.2s ease"}}>
          <div style={{marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.5rem",letterSpacing:"0.2em",color:color,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:"0.4rem"}}>HOW TO DO IT</div>
            <div style={{fontSize:"0.65rem",color:t.text2,lineHeight:1.8}}>{ex.how}</div>
          </div>
          <div style={{background:t.surface2,borderRadius:5,padding:"0.6rem 0.85rem",marginBottom:"0.7rem"}}>
            <div style={{fontSize:"0.5rem",letterSpacing:"0.18em",color:t.muted,textTransform:"uppercase",marginBottom:"0.3rem"}}>FORM CUES</div>
            <div style={{fontSize:"0.65rem",color:color,letterSpacing:"0.04em",fontWeight:500}}>{ex.cues}</div>
          </div>
          <div style={{background:t.accent+"0d",border:`1px solid ${t.accent}22`,borderRadius:5,padding:"0.6rem 0.85rem",marginBottom:"0.85rem"}}>
            <div style={{fontSize:"0.5rem",letterSpacing:"0.18em",color:t.accent,textTransform:"uppercase",marginBottom:"0.3rem"}}>⚠ COMMON MISTAKE</div>
            <div style={{fontSize:"0.62rem",color:t.text2,lineHeight:1.6}}>{ex.common}</div>
          </div>
          <div>
            <div style={{fontSize:"0.5rem",letterSpacing:"0.18em",color:t.muted,textTransform:"uppercase",marginBottom:"0.4rem"}}>SETS COMPLETED</div>
            <div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
              {Array.from({length:numSets},(_,si)=>{
                const sk=`${dayKey}_${idx}_s${si}`;
                const sd=checked[sk];
                return(
                  <div key={si} onClick={e=>{e.stopPropagation();onCheck(sk);}}
                    style={{width:38,height:38,borderRadius:5,cursor:"pointer",background:sd?color:t.surface2,border:`1.5px solid ${sd?color:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"0.72rem",fontWeight:700,color:sd?"#000":t.muted}}>{sd?"✓":`S${si+1}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── PAGE COMPONENTS ───────────────────────────────────────────────────────────

function HomePage({onNavigate,t}){
  const now=new Date();
  const todayIdx=now.getDay();
  const todaySched=WEEKLY_SCHEDULE.find(s=>s.day===DAYS[todayIdx]);
  const streak=getStreak();
  const todayData=ls.get("f1_tracker_"+todayKey(),{checked:{}});
  const done=HABITS.filter(h=>todayData.checked?.[h.id]).length;
  const pct=Math.round(done/HABITS.length*100);
  return(
    <div>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"5rem 2rem 5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 80% 60% at 30% 50%, ${t.accent}08, transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(6rem,22vw,18rem)",color:t.accent+"05",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none",letterSpacing:"-0.02em"}}>DRIVER</div>
        <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.4em",color:t.accent,textTransform:"uppercase",marginBottom:"0.9rem",animation:"fadeUp 0.6s ease 0.2s both"}}>// F1 DRIVER TRANSFORMATION PROTOCOL //</p>
        <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"clamp(3.5rem,12vw,9rem)",lineHeight:0.88,letterSpacing:"-0.01em",animation:"fadeUp 0.6s ease 0.35s both",color:t.text}}>
          BECOME<br/><span style={{color:t.accent,fontStyle:"italic",fontWeight:300}}>THE</span> DRIVER
        </h1>
        <p style={{marginTop:"1.5rem",fontSize:"0.72rem",color:t.muted,letterSpacing:"0.08em",maxWidth:460,lineHeight:1.8,animation:"fadeUp 0.6s ease 0.5s both"}}>
          162cm · 62kg · Starting today.<br/>
          F1 physical conditioning — gym, pool, nutrition, Salah, mindset. One plan.
        </p>
        <div style={{display:"flex",gap:"2.5rem",marginTop:"2.5rem",animation:"fadeUp 0.6s ease 0.65s both"}}>
          {[["4","Phases"],["7","Days/Week"],["31","Habits"],["1","Goal"]].map(([v,l])=>(
            <div key={l} style={{borderLeft:`2px solid ${t.accent}`,paddingLeft:"1rem"}}>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"2rem",fontWeight:700,color:t.text,display:"block",lineHeight:1}}>{v}</span>
              <span style={{fontSize:"0.52rem",letterSpacing:"0.25em",color:t.muted,textTransform:"uppercase"}}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"1rem",marginTop:"2.5rem",flexWrap:"wrap",animation:"fadeUp 0.6s ease 0.8s both"}}>
          <div onClick={()=>onNavigate("workouts")} style={{background:t.accent+"10",border:`1px solid ${t.accent}33`,borderRadius:8,padding:"1rem 1.5rem",flex:"1",minWidth:200,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background=t.accent+"1a"}
            onMouseLeave={e=>e.currentTarget.style.background=t.accent+"10"}>
            <div style={{fontSize:"0.52rem",letterSpacing:"0.2em",color:t.accent,marginBottom:"0.3rem"}}>// TODAY — {DAY_FULL[todayIdx].toUpperCase()}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:700,textTransform:"uppercase",color:t.text}}>{todaySched?.label||"Rest Day"}</div>
            <div style={{fontSize:"0.58rem",color:t.muted,marginTop:"0.2rem"}}>Tap to open session →</div>
          </div>
          <div onClick={()=>onNavigate("tracker")} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem 1.5rem",flex:"1",minWidth:200,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent+"66"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>
            <div style={{fontSize:"0.52rem",letterSpacing:"0.2em",color:t.muted,marginBottom:"0.3rem"}}>// TODAY'S PROGRESS</div>
            <div style={{height:4,background:t.surface2,borderRadius:2,overflow:"hidden",marginBottom:"0.5rem"}}>
              <div style={{height:"100%",width:`${pct}%`,background:t.accent,borderRadius:2,transition:"width 0.6s ease"}}/>
            </div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"1.4rem",fontWeight:700,color:t.text,lineHeight:1}}>{done}<span style={{fontSize:"0.8rem",color:t.muted}}>/{HABITS.length}</span></div>
            <div style={{fontSize:"0.58rem",color:t.muted,marginTop:"0.2rem"}}>{streak} day streak 🔥</div>
          </div>
        </div>
      </div>
      <div style={{padding:"5rem 2rem",borderTop:`1px solid ${t.border}`,maxWidth:960,margin:"0 auto"}}>
        <div style={{fontSize:"0.6rem",letterSpacing:"0.3em",color:t.accent,textTransform:"uppercase",marginBottom:"1.5rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>// YOUR WHY //</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"clamp(1.8rem,5vw,3.5rem)",fontWeight:300,fontStyle:"italic",color:t.text,lineHeight:1.25,maxWidth:700,marginBottom:"2rem"}}>
          "It doesn't matter where you start.<br/>It's how you progress from there."
        </div>
        <div style={{fontSize:"0.7rem",color:t.text2,lineHeight:2,maxWidth:600,marginBottom:"2rem"}}>
          You are building a body that can survive 5G cornering forces. A mind that stays sharp at 300km/h. A spirit anchored by Salah five times a day. A face that is clear, a posture that is proud, curls that are defined. You are not just getting fit — you are becoming the person who belongs in that cockpit. Every dead hang, every prayer, every set is a vote for that future.
        </div>
        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
          {[["Fajr","Start every day with Allah"],["Dead Hang","Decompress. Grow."],["Face Pull","Fix the neck."],["Hip Thrust","Build the shape."],["Zone 2","Build the engine."]].map(([t1,t2])=>(
            <div key={t1} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:6,padding:"0.75rem 1rem"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.85rem",fontWeight:700,textTransform:"uppercase",color:t.text,marginBottom:"0.15rem"}}>{t1}</div>
              <div style={{fontSize:"0.58rem",color:t.muted}}>{t2}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkoutsPage({t}){
  const todayDay=DAYS[new Date().getDay()];
  const [activeDay,setActiveDay]=useState(todayDay);
  const w=WORKOUTS[activeDay];
  const sched=WEEKLY_SCHEDULE.find(s=>s.day===activeDay);
  const color=sched?.color||t.accent;
  const storageKey=`f1_workout_checks_${activeDay}_${todayKey()}`;
  const [checked,setChecked]=useState(()=>ls.get(storageKey));
  const [weights,setWeights]=useState(()=>ls.get(`f1_weights_${activeDay}_${todayKey()}`));

  const handleCheck=(key)=>{const next={...checked,[key]:!checked[key]};setChecked(next);ls.set(storageKey,next);};
  const handleDay=(day)=>{setActiveDay(day);setChecked(ls.get(`f1_workout_checks_${day}_${todayKey()}`));setWeights(ls.get(`f1_weights_${day}_${todayKey()}`));};
  const updateWeight=(exIdx,val)=>{const next={...weights,[exIdx]:val};setWeights(next);ls.set(`f1_weights_${activeDay}_${todayKey()}`,next);};
  const resetChecks=()=>{setChecked({});ls.set(storageKey,{});};

  const totalEx=w.exercises.length;
  const doneEx=w.exercises.filter((_,i)=>checked[`${activeDay}_${i}`]).length;

  return(
    <div>
      <SectionHeader num="01" title="Weekly Training" t={t}/>
      <NoteBox t={t}><strong style={{color:t.accent}}>Tap a day</strong> to see the session. <strong style={{color:t.accent}}>Tap any exercise</strong> to expand full instructions, form cues, common mistakes, and set tracker. Log the weight you used below each exercise.</NoteBox>
      <RestTimer t={t}/>
      <p style={{fontSize:"0.58rem",color:t.muted,letterSpacing:"0.1em",marginBottom:"0.75rem"}}>// TAP A DAY //</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"0.4rem",marginBottom:"1.5rem"}}>
        {WEEKLY_SCHEDULE.map(s=>{
          const isA=activeDay===s.day;
          return(
            <div key={s.day} onClick={()=>handleDay(s.day)}
              style={{background:isA?s.color+"15":t.cardBg,border:`1.5px solid ${isA?s.color:t.border}`,borderRadius:6,padding:"0.7rem 0.3rem",textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{if(!isA)e.currentTarget.style.borderColor=s.color+"66";}}
              onMouseLeave={e=>{if(!isA)e.currentTarget.style.borderColor=t.border;}}>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"0.6rem",fontWeight:700,color:isA?s.color:t.muted,letterSpacing:"0.15em",textTransform:"uppercase",display:"block",marginBottom:"0.25rem"}}>{s.day}</span>
              <div style={{fontSize:"0.52rem",color:isA?t.text2:t.muted,lineHeight:1.3,marginBottom:"0.35rem"}}>{s.label}</div>
              <span style={{background:s.color+"22",color:s.color,border:`1px solid ${s.color}44`,borderRadius:3,padding:"1px 5px",fontSize:"0.45rem",letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{s.type}</span>
            </div>
          );
        })}
      </div>
      <div style={{background:`linear-gradient(to right, ${color}0d, transparent)`,border:`1px solid ${color}33`,borderLeft:`3px solid ${color}`,borderRadius:"8px 8px 0 0",padding:"1.2rem 1.5rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.75rem"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.5rem",fontWeight:700,textTransform:"uppercase",color:t.text}}>{w.title}</div>
            <div style={{fontSize:"0.58rem",color:t.muted,marginTop:"0.15rem"}}>{w.type}</div>
          </div>
          <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}}><Badge color={color}>{w.duration}</Badge><Badge color={t.muted}>{w.rest}</Badge></div>
        </div>
        <div style={{marginTop:"0.85rem",background:t.surface2,borderRadius:5,padding:"0.6rem 0.85rem"}}>
          <span style={{fontSize:"0.5rem",letterSpacing:"0.2em",color:color,textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>WARM-UP: </span>
          <span style={{fontSize:"0.62rem",color:t.text2}}>{w.warmup}</span>
        </div>
        <div style={{marginTop:"0.75rem",fontSize:"0.62rem",color:t.muted,lineHeight:1.6}}>{w.note}</div>
      </div>
      <div style={{background:color+"12",padding:"0.6rem 1.2rem",display:"flex",alignItems:"center",gap:"1rem",borderLeft:`3px solid ${color}44`,borderRight:`1px solid ${color}22`}}>
        <div style={{flex:1,height:4,background:t.surface2,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${totalEx>0?(doneEx/totalEx)*100:0}%`,background:color,borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>
        <div style={{fontSize:"0.62rem",color:color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,whiteSpace:"nowrap"}}>{doneEx}/{totalEx} done</div>
        {doneEx>0&&<button onClick={resetChecks} style={{fontSize:"0.52rem",color:t.muted,background:"none",border:"none",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",padding:0}}>reset</button>}
      </div>
      <div style={{background:t.surface,border:`1px solid ${color}22`,borderTop:"none",borderLeft:`3px solid ${color}22`,borderRadius:"0 0 8px 8px",padding:"0.75rem"}}>
        {w.exercises.map((ex,i)=>(
          <div key={`${activeDay}_${i}`}>
            <ExerciseCard ex={ex} idx={i} color={color} checked={checked} onCheck={handleCheck} dayKey={activeDay} t={t}/>
            <div style={{marginTop:"-0.2rem",marginBottom:"0.6rem",paddingLeft:"3.2rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontSize:"0.52rem",color:t.muted,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>Weight used:</span>
              <input value={weights[i]||""} onChange={e=>updateWeight(i,e.target.value)} placeholder="e.g. 30kg / bodyweight"
                style={{background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:4,padding:"0.2rem 0.5rem",fontSize:"0.6rem",color:t.text,fontFamily:"'Share Tech Mono',monospace",outline:"none",width:170}}/>
            </div>
          </div>
        ))}
      </div>
      {doneEx===totalEx&&totalEx>0&&(
        <div style={{textAlign:"center",padding:"2rem",background:color+"0d",border:`1px solid ${color}33`,borderRadius:8,marginTop:"1rem",animation:"fadeUp 0.4s ease"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🏁</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.4rem",fontWeight:700,textTransform:"uppercase",color,marginBottom:"0.3rem"}}>Session Complete</div>
          <div style={{fontSize:"0.62rem",color:t.muted}}>Log it in tracker · Drink water · Eat within 45 minutes</div>
        </div>
      )}
    </div>
  );
}

function TrackerPage({t}){
  const [state,setState]=useState(()=>ls.get("f1_tracker_"+todayKey(),{checked:{},mood:"",energy:0,notes:""}));
  const [toast,setToast]=useState("");
  const [showHistory,setShowHistory]=useState(false);
  const history=loadHistory();
  const streak=getStreak();
  const now=new Date();
  const toggle=(id)=>{const next={...state,checked:{...state.checked,[id]:!state.checked[id]}};setState(next);ls.set("f1_tracker_"+todayKey(),next);};
  const setMood=(mood)=>{const next={...state,mood};setState(next);ls.set("f1_tracker_"+todayKey(),next);};
  const setEnergy=(energy)=>{const next={...state,energy};setState(next);ls.set("f1_tracker_"+todayKey(),next);};
  const setNotes=(notes)=>{const next={...state,notes};setState(next);ls.set("f1_tracker_"+todayKey(),next);};
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const reset=()=>{if(!window.confirm("Reset today?"))return;const next={checked:{},mood:"",energy:0,notes:""};setState(next);ls.set("f1_tracker_"+todayKey(),next);showToast("Reset. Go.");};
  const total=HABITS.length;const done=HABITS.filter(h=>state.checked?.[h.id]).length;const pct=Math.round(done/total*100);
  const cats=[...new Set(HABITS.map(h=>h.cat))];
  const streakDots=Array.from({length:30},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(29-i));
    const key=d.toISOString().slice(0,10);const isToday=i===29;let p=0;
    try{const raw=localStorage.getItem("f1_tracker_"+key);if(raw){const s=JSON.parse(raw);p=HABITS.filter(h=>s.checked?.[h.id]).length/HABITS.length;}}catch{}
    return{d,isToday,pct:p,dayNum:d.getDate()};
  });
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem",paddingBottom:"0.75rem",borderBottom:`1px solid ${t.accent}22`}}>
        <div>
          <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"2rem",fontWeight:700,textTransform:"uppercase",color:t.text}}>Daily <span style={{color:t.accent}}>Tracker</span></h2>
          <div style={{fontSize:"0.58rem",color:t.muted,letterSpacing:"0.1em",marginTop:"0.2rem"}}>// LOG · TRACK · STREAK //</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"1.8rem",fontWeight:700,color:t.accent,lineHeight:1}}>{DAY_FULL[now.getDay()].slice(0,3).toUpperCase()}</div>
          <div style={{fontSize:"0.52rem",letterSpacing:"0.12em",color:t.muted,textTransform:"uppercase"}}>{MONTHS[now.getMonth()]} {now.getDate()}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.75rem",marginBottom:"1.2rem"}}>
        {[[done,"Done",t.accent],[total,"Total","#00b4d8"],[streak,"Streak","#06d6a0"],[pct+"%","Done %","#ffd166"]].map(([v,l,c])=>(
          <div key={l} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"0.9rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c}}/>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"1.7rem",fontWeight:700,color:c,lineHeight:1}}>{v}</div>
            <div style={{fontSize:"0.5rem",letterSpacing:"0.15em",color:t.muted,textTransform:"uppercase",marginTop:"0.2rem"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{background:t.surface2,borderRadius:4,height:6,marginBottom:"1.2rem",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(to right, ${t.accent}, #ff6b6b)`,borderRadius:4,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
        <div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:t.accent,textTransform:"uppercase",marginBottom:"0.6rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>// 30-DAY STREAK //</div>
        <div style={{display:"flex",gap:"0.25rem",flexWrap:"wrap"}}>
          {streakDots.map((dot,i)=>(
            <div key={i} title={dot.d.toISOString().slice(0,10)}
              style={{width:26,height:26,borderRadius:4,background:dot.pct>=0.5?t.accent:t.surface2,border:`1px solid ${dot.isToday?t.accent:dot.pct>=0.5?t.accent+"66":t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.5rem",color:dot.pct>=0.5?"#fff":dot.isToday?t.accent:t.muted,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>
              {dot.dayNum}
            </div>
          ))}
        </div>
      </div>
      {cats.map(cat=>{
        const catHabits=HABITS.filter(h=>h.cat===cat);
        const cm=CAT_META[cat];const catDone=catHabits.filter(h=>state.checked?.[h.id]).length;
        return(
          <div key={cat} style={{marginBottom:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.5rem",paddingBottom:"0.4rem",borderBottom:`1px solid ${cm.color}22`}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:cm.color,flexShrink:0}}/>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:cm.color}}>{cm.label}</span>
              <span style={{fontSize:"0.55rem",color:t.muted,marginLeft:"auto"}}>{catDone}/{catHabits.length}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
              {catHabits.map(h=>{
                const isDone=!!state.checked?.[h.id];
                return(
                  <div key={h.id} onClick={()=>toggle(h.id)}
                    style={{display:"flex",alignItems:"center",gap:"0.85rem",padding:"0.6rem 0.85rem",background:isDone?cm.color+"0d":t.surface,border:`1px solid ${isDone?cm.color+"44":t.border}`,borderRadius:5,cursor:"pointer",transition:"all 0.15s",userSelect:"none"}}
                    onMouseEnter={e=>{if(!isDone)e.currentTarget.style.borderColor=cm.color+"33";}}
                    onMouseLeave={e=>{if(!isDone)e.currentTarget.style.borderColor=t.border;}}>
                    <div style={{width:20,height:20,borderRadius:4,flexShrink:0,background:isDone?cm.color:"transparent",border:`1.5px solid ${isDone?cm.color:t.border2}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                      {isDone&&<span style={{fontSize:"0.65rem",color:"#000",fontWeight:700}}>✓</span>}
                    </div>
                    <span style={{fontSize:"0.68rem",color:isDone?t.muted:t.text,textDecoration:isDone?"line-through":"none",flex:1}}>{h.label}</span>
                    <span style={{fontSize:"0.85rem",opacity:isDone?0.3:0.7}}>{h.icon}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.5rem"}}>
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem"}}>
          <div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:t.accent,textTransform:"uppercase",marginBottom:"0.6rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>// Mood //</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.85rem"}}>
            {["🔥 Fired up","😤 Focused","😌 Calm","😴 Tired","😔 Low"].map(m=>{
              const isSel=state.mood===m;
              return <button key={m} onClick={()=>setMood(m)} style={{padding:"0.3rem 0.55rem",border:`1px solid ${isSel?t.accent:t.border}`,borderRadius:4,background:isSel?t.accent:"transparent",color:isSel?"#fff":t.muted,cursor:"pointer",fontSize:"0.6rem",transition:"all 0.15s"}}>{m}</button>;
            })}
          </div>
          <div style={{fontSize:"0.52rem",color:t.muted,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:"0.4rem"}}>// Energy //</div>
          <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
            <span style={{fontSize:"0.52rem",color:t.muted}}>Low</span>
            {[1,2,3,4,5].map(n=>{const cs=["#555","#f4a261","#ffd166","#06d6a0",t.accent];const lit=(state.energy||0)>=n;return <div key={n} onClick={()=>setEnergy(n)} style={{width:24,height:24,borderRadius:"50%",cursor:"pointer",background:lit?cs[n-1]:t.surface2,border:`1.5px solid ${lit?cs[n-1]:t.border}`,transition:"all 0.15s"}}/>;})}
            <span style={{fontSize:"0.52rem",color:t.muted}}>High</span>
          </div>
        </div>
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem"}}>
          <div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:t.accent,textTransform:"uppercase",marginBottom:"0.6rem",fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>// Notes //</div>
          <textarea value={state.notes||""} onChange={e=>setNotes(e.target.value)} placeholder="Wins? What to improve? How did it feel?"
            style={{width:"100%",minHeight:90,resize:"vertical",border:`1px solid ${t.border}`,borderRadius:4,padding:"0.6rem",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.62rem",color:t.text,background:t.inputBg,outline:"none",lineHeight:1.6}}
            onFocus={e=>e.target.style.borderColor=t.accent+"66"} onBlur={e=>e.target.style.borderColor=t.border}/>
        </div>
      </div>
      <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",marginBottom:"2rem"}}>
        {[["✓ Save Day",()=>{ls.set("f1_tracker_"+todayKey(),state);showToast("✓ Saved!");},t.accent,true],["↺ Reset",reset,t.muted,false],[showHistory?"Hide History":"📋 History",()=>setShowHistory(h=>!h),"#00b4d8",false]].map(([label,fn,c,primary])=>(
          <button key={label} onClick={fn}
            style={{padding:"0.6rem 1.2rem",background:primary?c:"transparent",color:primary?"#fff":c,border:`1.5px solid ${c}44`,borderRadius:5,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:"0.82rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c;if(!primary)e.currentTarget.style.background=c+"15";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=c+"44";if(!primary)e.currentTarget.style.background="transparent";}}>
            {label}
          </button>
        ))}
      </div>
      {showHistory&&(
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"1.1rem",fontWeight:700,textTransform:"uppercase",color:t.text,marginBottom:"1rem"}}>Past 30 Days</div>
          {history.length===0?<div style={{fontSize:"0.62rem",color:t.muted}}>No history yet — save your first day.</div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:"0.6rem"}}>
            {history.map((h,i)=>{
              const d=HABITS.filter(hb=>h.checked?.[hb.id]).length;const p=Math.round(d/HABITS.length*100);
              const dl=DAY_FULL[h.d.getDay()].slice(0,3)+" "+MONTHS[h.d.getMonth()]+" "+h.d.getDate();
              return(
                <div key={i} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:6,padding:"0.85rem"}}>
                  <div style={{fontSize:"0.52rem",letterSpacing:"0.12em",color:t.accent,marginBottom:"0.3rem",textTransform:"uppercase"}}>{dl}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:"1.4rem",fontWeight:700,color:t.text,lineHeight:1}}>{d}<span style={{fontSize:"0.6rem",color:t.muted}}>/{HABITS.length}</span></div>
                  <div style={{fontSize:"0.55rem",color:t.muted,margin:"0.2rem 0 0.5rem"}}>{h.mood||"—"}</div>
                  <div style={{height:3,background:t.surface2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:t.accent,borderRadius:2}}/></div>
                </div>
              );
            })}
          </div>}
        </div>
      )}
      {toast&&<div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:t.text,color:t.bg,padding:"0.6rem 1.5rem",borderRadius:6,fontSize:"0.65rem",letterSpacing:"0.1em",border:`1px solid ${t.accent}44`,zIndex:9999,animation:"fadeUp 0.2s ease"}}>{toast}</div>}
    </div>
  );
}
// ── MEASUREMENTS PAGE ────────────────────────────────────────────────────────
function MeasurementsPage({t}){
  const LABELS=MEASUREMENTS_LABELS;
  const empty=()=>Object.fromEntries(LABELS.map(l=>[l.key,""]));
  const [form,setForm]=useState(empty());
  const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("f1_measurements")||"[]");}catch{return [];}});
  const [toast,setToast]=useState("");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2000);};
  const save=()=>{
    const vals=Object.fromEntries(LABELS.map(l=>[l.key,parseFloat(form[l.key])||null]));
    const entry={date:new Date().toISOString().slice(0,10),vals};
    const updated=[entry,...history.slice(0,59)];
    setHistory(updated);
    localStorage.setItem("f1_measurements",JSON.stringify(updated));
    setForm(empty());
    showToast("✓ Measurements logged");
  };
  const hasSome=LABELS.some(l=>form[l.key]!=="");
  const last=history[0]?.vals;
  const prev=history[1]?.vals;
  const delta=(key)=>{
    if(!last||!prev||!last[key]||!prev[key])return null;
    return (last[key]-prev[key]).toFixed(1);
  };
  const F="'Rajdhani',sans-serif";
  const M="'Share Tech Mono',monospace";
  return(
    <div style={{padding:"1.5rem 1rem 7rem",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:"clamp(1.5rem,5vw,2.2rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text,marginBottom:"0.25rem"}}>MEASUREMENTS</div>
      <div style={{fontFamily:M,fontSize:"0.58rem",color:t.muted,letterSpacing:"0.15em",marginBottom:"1.5rem"}}>// LOG YOUR BODY STATS //</div>

      {last&&(
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
          <div style={{fontFamily:F,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:"0.75rem"}}>LATEST — {history[0].date}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"0.5rem"}}>
            {LABELS.map(l=>{
              const d=delta(l.key);
              const dNum=parseFloat(d);
              const isGood=(l.key==="weight"&&dNum<=0)||(l.key==="waist"&&dNum<=0)||(l.key!=="weight"&&l.key!=="waist"&&dNum>=0);
              const dColor=d===null?"transparent":dNum===0?"#888":isGood?"#06d6a0":"#e8002d";
              return last[l.key]?(
                <div key={l.key} style={{background:t.surface2,border:`1px solid ${t.border}`,borderRadius:6,padding:"0.6rem 0.75rem"}}>
                  <div style={{fontFamily:M,fontSize:"0.5rem",color:t.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.25rem"}}>{l.label}</div>
                  <div style={{fontFamily:F,fontSize:"1.3rem",fontWeight:700,color:t.text,lineHeight:1}}>{last[l.key]}<span style={{fontSize:"0.55rem",color:t.muted}}>{l.unit}</span></div>
                  {d!==null&&dNum!==0&&<div style={{fontFamily:M,fontSize:"0.55rem",color:dColor,marginTop:"0.2rem"}}>{dNum>0?"+":""}{d}</div>}
                </div>
              ):null;
            })}
          </div>
        </div>
      )}

      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
        <div style={{fontFamily:F,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:"0.75rem"}}>// LOG TODAY //</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"0.75rem",marginBottom:"1rem"}}>
          {LABELS.map(l=>(
            <div key={l.key}>
              <label style={{fontFamily:M,fontSize:"0.52rem",color:t.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:"0.3rem"}}>{l.label} <span style={{color:t.muted,opacity:0.6}}>({l.unit})</span></label>
              <input type="number" step="0.1" placeholder="—" value={form[l.key]}
                onChange={e=>setForm(f=>({...f,[l.key]:e.target.value}))}
                style={{width:"100%",background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:4,padding:"0.5rem 0.6rem",fontFamily:F,fontSize:"0.9rem",fontWeight:700,color:t.text,outline:"none",textAlign:"center"}}
                onFocus={e=>e.target.style.borderColor=t.accent+"66"}
                onBlur={e=>e.target.style.borderColor=t.border}/>
            </div>
          ))}
        </div>
        <button onClick={save} disabled={!hasSome}
          style={{padding:"0.6rem 1.5rem",background:hasSome?t.accent:"transparent",color:hasSome?"#fff":t.muted,border:`1.5px solid ${hasSome?t.accent:t.border}`,borderRadius:5,cursor:hasSome?"pointer":"default",fontFamily:F,fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",transition:"all 0.2s"}}>
          SAVE ENTRY
        </button>
      </div>

      {history.length>1&&(
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem"}}>
          <div style={{fontFamily:F,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:"0.75rem"}}>// HISTORY //</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:M,fontSize:"0.55rem"}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${t.border}`}}>
                  <th style={{textAlign:"left",padding:"0.4rem 0.5rem",color:t.muted,letterSpacing:"0.12em",whiteSpace:"nowrap"}}>DATE</th>
                  {LABELS.map(l=><th key={l.key} style={{textAlign:"right",padding:"0.4rem 0.5rem",color:t.muted,letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{l.short}</th>)}
                </tr>
              </thead>
              <tbody>
                {history.slice(0,12).map((row,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${t.border}22`,background:i%2===0?"transparent":t.surface2+"44"}}>
                    <td style={{padding:"0.45rem 0.5rem",color:t.text2,whiteSpace:"nowrap"}}>{row.date}</td>
                    {LABELS.map(l=>{
                      const curr=row.vals[l.key];
                      const nextRow=history[i+1]?.vals;
                      const d=curr&&nextRow?.[l.key]?curr-nextRow[l.key]:null;
                      const isGood=d===null||d===0?null:(l.key==="weight"||l.key==="waist")?d<0:d>0;
                      return(
                        <td key={l.key} style={{textAlign:"right",padding:"0.45rem 0.5rem",color:isGood===null?t.text2:isGood?"#06d6a0":"#e8002d",fontWeight:700}}>
                          {curr||"—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {toast&&<div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:t.text,color:t.bg,padding:"0.6rem 1.5rem",borderRadius:6,fontSize:"0.65rem",letterSpacing:"0.1em",zIndex:9999}}>{toast}</div>}
    </div>
  );
}

// ── QURAN PAGE ────────────────────────────────────────────────────────────────
function QuranPage({t}){
  const [statuses,setStatuses]=useState(()=>{try{return JSON.parse(localStorage.getItem("f1_quran")||"{}");}catch{return {};}});
  const [streak,setStreak]=useState(()=>{try{return JSON.parse(localStorage.getItem("f1_quran_streak")||'{"count":0,"last":""}');}catch{return {count:0,last:""};}} );
  const [notes,setNotes]=useState(()=>localStorage.getItem("f1_quran_notes")||"");
  const [toast,setToast]=useState("");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),2200);};
  const STATUS_OPTS=[{k:"none",label:"Not Started",color:t.muted},{k:"learning",label:"Learning",color:"#ffd166"},{k:"done",label:"Memorised ✓",color:"#06d6a0"}];
  const setStatus=(id,k)=>{
    const u={...statuses,[id]:k};
    setStatuses(u);
    localStorage.setItem("f1_quran",JSON.stringify(u));
  };
  const memorised=JUZ_AMMA.filter(s=>statuses[s.id]==="done").length;
  const learning=JUZ_AMMA.filter(s=>statuses[s.id]==="learning").length;
  const checkIn=()=>{
    const today=new Date().toISOString().slice(0,10);
    if(streak.last===today){showToast("Already checked in today ✓");return;}
    const yesterday=new Date(Date.now()-86400000).toISOString().slice(0,10);
    const newCount=streak.last===yesterday?streak.count+1:1;
    const ns={count:newCount,last:today};
    setStreak(ns);localStorage.setItem("f1_quran_streak",JSON.stringify(ns));
    showToast(`✓ Day ${newCount} streak! Keep going.`);
  };
  const saveNotes=()=>{localStorage.setItem("f1_quran_notes",notes);showToast("✓ Notes saved");};
  const F="'Rajdhani',sans-serif";
  const M="'Share Tech Mono',monospace";
  return(
    <div style={{padding:"1.5rem 1rem 7rem",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:"clamp(1.5rem,5vw,2.2rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text,marginBottom:"0.25rem"}}>QURAN</div>
      <div style={{fontFamily:M,fontSize:"0.58rem",color:t.muted,letterSpacing:"0.15em",marginBottom:"1.5rem"}}>// JUZ AMMA MEMORISATION //</div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.6rem",marginBottom:"1.5rem"}}>
        {[{n:memorised,l:"Memorised",c:"#06d6a0"},{n:learning,l:"Learning",c:"#ffd166"},{n:JUZ_AMMA.length-memorised-learning,l:"Not Started",c:t.muted}].map(x=>(
          <div key={x.l} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"0.85rem",textAlign:"center"}}>
            <div style={{fontFamily:F,fontSize:"2rem",fontWeight:700,color:x.c,lineHeight:1}}>{x.n}</div>
            <div style={{fontFamily:M,fontSize:"0.5rem",color:t.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:"0.2rem"}}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
        <div>
          <div style={{fontFamily:F,fontSize:"2.5rem",fontWeight:700,color:t.accent,lineHeight:1}}>{streak.count}</div>
          <div style={{fontFamily:M,fontSize:"0.5rem",color:t.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Day Streak</div>
        </div>
        <div style={{flex:1,minWidth:140}}>
          <div style={{fontFamily:M,fontSize:"0.58rem",color:t.text2,marginBottom:"0.5rem"}}>Daily Quran after Fajr builds the habit. Check in to keep your streak alive.</div>
          <button onClick={checkIn} style={{padding:"0.5rem 1rem",background:t.accent,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontFamily:F,fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>✓ CHECK IN TODAY</button>
        </div>
      </div>

      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",marginBottom:"1.5rem"}}>
        <div style={{fontFamily:F,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:"0.75rem"}}>// SURAH TRACKER //</div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
          {JUZ_AMMA.map(s=>{
            const st=statuses[s.id]||"none";
            const stObj=STATUS_OPTS.find(x=>x.k===st);
            return(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.5rem 0.6rem",background:t.surface2,border:`1px solid ${st==="done"?"#06d6a044":st==="learning"?"#ffd16644":t.border}`,borderRadius:5}}>
                <div style={{fontFamily:M,fontSize:"0.5rem",color:t.muted,width:22,textAlign:"right",flexShrink:0}}>{s.num}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Noto Naskh Arabic',serif",fontSize:"0.85rem",color:t.text,direction:"rtl",marginBottom:"0.1rem"}}>{s.arabic}</div>
                  <div style={{fontFamily:M,fontSize:"0.52rem",color:t.muted}}>{s.name} · {s.verses}v</div>
                </div>
                <div style={{display:"flex",gap:"0.25rem",flexShrink:0}}>
                  {STATUS_OPTS.map(opt=>(
                    <button key={opt.k} onClick={()=>setStatus(s.id,opt.k)}
                      style={{padding:"0.2rem 0.35rem",border:`1px solid ${st===opt.k?opt.color:t.border}`,borderRadius:3,background:st===opt.k?opt.color+"22":"transparent",color:st===opt.k?opt.color:t.muted,cursor:"pointer",fontFamily:M,fontSize:"0.45rem",letterSpacing:"0.05em",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem"}}>
        <div style={{fontFamily:F,fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.accent,marginBottom:"0.6rem"}}>// NOTES //</div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Which surahs to focus on this week? What needs more revision?"
          style={{width:"100%",minHeight:100,resize:"vertical",border:`1px solid ${t.border}`,borderRadius:4,padding:"0.6rem",fontFamily:M,fontSize:"0.62rem",color:t.text,background:t.inputBg,outline:"none",lineHeight:1.6}}
          onFocus={e=>e.target.style.borderColor=t.accent+"66"} onBlur={e=>e.target.style.borderColor=t.border}/>
        <button onClick={saveNotes} style={{marginTop:"0.5rem",padding:"0.45rem 1rem",background:"transparent",color:t.accent,border:`1.5px solid ${t.accent}44`,borderRadius:5,cursor:"pointer",fontFamily:F,fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>SAVE NOTES</button>
      </div>

      {toast&&<div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:t.text,color:t.bg,padding:"0.6rem 1.5rem",borderRadius:6,fontSize:"0.65rem",letterSpacing:"0.1em",zIndex:9999}}>{toast}</div>}
    </div>
  );
}
// ── PILLARS PAGE ─────────────────────────────────────────────────────────────
function PillarsPage({t}){
  const F="'Rajdhani',sans-serif";
  const M="'Share Tech Mono',monospace";
  const PILLARS=[
    {icon:"🏎",title:"F1 Fitness",color:"#e8002d",items:["Cardio base: Zone 2 × 3 per week builds the aerobic engine F1 demands","Core stability: Pallof press, dead bug, hanging leg raise — resist rotation under load","Grip + shoulder endurance: dead hang daily, pull-ups, face pulls","Race-condition training: short rest between sets, elevated heart rate throughout","Long-term: 5 phases over 40 weeks — Foundation → Build → Strength → Accelerate → Elite"]},
    {icon:"🧭",title:"Posture & Neck",color:"#00b4d8",items:["Morning protocol every single day — chin tucks, wall angels, band pull-aparts","Cable face pulls every gym session — rear delts and upper traps are your posture muscles","Deadlifts and rows build the back that holds your spine tall without effort","Hip flexor stretch daily — tight hip flexors cause anterior tilt making belly protrude","Foam roll upper back — this one thing visibly changes your posture in weeks","Stand tall: ears over shoulders, shoulders over hips, hips over ankles"]},
    {icon:"🌿",title:"Hair & Skin",color:"#06d6a0",items:["AM routine: gentle cleanser → niacinamide serum → SPF 30+ (non-negotiable)","PM routine: cleanser → retinol or salicylic acid 3×/week → moisturiser","Change pillowcase every 3–4 days — biggest single change for acne","Drink 2–3L water daily — skin hydration is visible within 2 weeks","Cut sugar and dairy for 4 weeks as an experiment — many see dramatic clearing","Curls: deep condition weekly, no heat, refresh with leave-in spray and scrunch","Scalp massage 5 min daily — increases blood flow for thicker, faster growth"]},
    {icon:"⚡",title:"Energy & Mind",color:"#ffd166",items:["Sleep 7–8 hours non-negotiable — HGH released in deep sleep burns fat, builds muscle, clears skin","No phone first 30 minutes of the day — this alone changes your entire day energy","Natural light within 10 minutes of waking — sets circadian rhythm for the whole day","90-min deep work blocks, phone in another room, then real break (walk, not scroll)","Write 1–3 Most Important Tasks the night before. Do them before anything else","Treat yourself like a project: track, review, adjust, repeat every Sunday"]},
    {icon:"🕌",title:"Salah & Quran",color:"#a8dadc",items:["5 daily prayers are the structure your whole day hangs on — don't negotiate with them","Quran after Fajr: even 5 minutes daily compounds over years into full memorisation","Juz Amma target: 1 surah per week = complete in under a year starting from An-Nas","The discipline of prayer trains the same muscle that makes you go to the gym","Morning remembrance (adhkar) 5 min — frames your mindset before the day starts","Week of missed prayers is never erased. Qadha and return. Never miss twice in a row."]},
    {icon:"📐",title:"Body Composition",color:"#c77dff",items:["Goal: body recomposition — lose fat, gain muscle. Scale may barely move but shape transforms completely","Target macros: 100g protein, 150g carbs, 55g fat = ~1600 kcal. Sustainable, not extreme","Hip thrusts and cable kickbacks 3× per week — in 3 months glutes visibly change","Lateral raises and shoulder press 2× per week — wider shoulders create V-taper illusion","Walk 8,000+ steps on non-gym days — low intensity fat burning that adds up","Measurements weekly: waist, hips, shoulders — these numbers tell the real story"]}
  ];
  return(
    <div style={{padding:"1.5rem 1rem 7rem",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:"clamp(1.5rem,5vw,2.2rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text,marginBottom:"0.25rem"}}>PILLARS</div>
      <div style={{fontFamily:M,fontSize:"0.58rem",color:t.muted,letterSpacing:"0.15em",marginBottom:"1.5rem"}}>// YOUR 6 TRANSFORMATION PILLARS //</div>
      <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        {PILLARS.map(p=>(
          <div key={p.title} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1.2rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right, ${p.color}, transparent)`}}/>
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.75rem"}}>
              <span style={{fontSize:"1.4rem"}}>{p.icon}</span>
              <div style={{fontFamily:F,fontSize:"1rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:p.color}}>{p.title}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.35rem"}}>
              {p.items.map((item,i)=>(
                <div key={i} style={{display:"flex",gap:"0.6rem",alignItems:"flex-start"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:p.color,flexShrink:0,marginTop:"0.35rem"}}/>
                  <div style={{fontFamily:M,fontSize:"0.62rem",color:t.text2,lineHeight:1.55}}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROGRESSION PAGE ─────────────────────────────────────────────────────────
function ProgressionPage({t}){
  const F="'Rajdhani',sans-serif";
  const M="'Share Tech Mono',monospace";
  const PHASES=[
    {num:"01",weeks:"Weeks 1–6",title:"Foundation",color:"#00b4d8",focus:"Master form. Build baseline fitness. Establish habits.",
     goals:["Learn correct form for every exercise before adding weight","Hit all 7 sessions per week consistently — this is the only goal","Lower body 3 × 12–15 (light), Upper 3 × 12–15 (light)","Rest 90 sec between sets — no rushing","After 4 weeks: can you do all sets comfortably? Move to Phase 2"]},
    {num:"02",weeks:"Weeks 7–14",title:"Build",color:"#06d6a0",focus:"Start adding load. Progressive overload begins.",
     goals:["Add 2.5kg to lower body compounds every 2 weeks if sets feel manageable","Add 1.25kg to upper body every 2 weeks","Drop rest to 75 sec between sets","4 × 10–12 for main compounds (squat, hip thrust, deadlift)","Track every weight. You must beat last session or same session last week."]},
    {num:"03",weeks:"Weeks 15–22",title:"Strength",color:"#ffd166",focus:"Heavy compounds. Visible recomposition begins.",
     goals:["4 × 8–10 for main lifts. Weight is challenging — last 2 reps hard","Rest 90 sec on heavy sets — quality > speed","Glute focus: hip thrust should feel significantly heavier than Phase 1","Swimming intervals: Phase 2 protocol — 5 rounds of 4 hard + 2 easy lengths","Cardio: continuous Zone 2, 30+ minutes"]},
    {num:"04",weeks:"Weeks 23–32",title:"Accelerate",color:"#e8002d",focus:"Near-peak training intensity. F1 conditioning target.",
     goals:["4–5 × 6–8 on main lifts. This is challenging territory.","Rest 60–75 sec on accessory work, 2 min on heavy compounds","Running: Phase 3 tempo + sprints — 10+20+5 structure","Swimming: 20-min continuous with pace changes + sprint finishers","Body measurements showing significant positive changes by now"]},
    {num:"05",weeks:"Weeks 33–40",title:"Elite",color:"#c77dff",focus:"F1-ready. Race simulation. Peak performance.",
     goals:["Training feels automatic — it is part of your identity now","Race simulation days: high intensity circuits mimicking sustained effort","All 5 pillars running simultaneously: fitness, posture, nutrition, skin, deen","Review from Week 1 measurements — the transformation is visible and measurable","Begin thinking about the next 40 weeks: this is a lifestyle, not a sprint"]}
  ];
  const RULES=[
    {rule:"2-for-2",desc:"If you can complete 2 extra reps on the last set for 2 consecutive sessions — add weight next session."},
    {rule:"Never Skip Heavy",desc:"If you're tired, go lighter. Never skip the main compound of the day — it's the whole session."},
    {rule:"Form First",desc:"A lighter weight with perfect form builds more muscle than heavy weight with bad form. Always."},
    {rule:"Deload Every 6 Weeks",desc:"One week at 60% weight. Not laziness — it's when your body consolidates the gains you built."},
    {rule:"Log Everything",desc:"Weight, reps, how it felt. Review weekly. This is the data that drives the program."},
  ];
  return(
    <div style={{padding:"1.5rem 1rem 7rem",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:"clamp(1.5rem,5vw,2.2rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text,marginBottom:"0.25rem"}}>PROGRESSION</div>
      <div style={{fontFamily:M,fontSize:"0.58rem",color:t.muted,letterSpacing:"0.15em",marginBottom:"1.5rem"}}>// 40-WEEK F1 READINESS ROADMAP //</div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"2rem"}}>
        {PHASES.map(p=>(
          <div key={p.num} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,padding:"1rem",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(to right, ${p.color}, transparent)`}}/>
            <div style={{display:"flex",alignItems:"baseline",gap:"0.75rem",marginBottom:"0.4rem"}}>
              <div style={{fontFamily:F,fontSize:"2rem",fontWeight:700,color:p.color,lineHeight:1,opacity:0.4}}>{p.num}</div>
              <div>
                <div style={{fontFamily:F,fontSize:"1.1rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:p.color}}>{p.title}</div>
                <div style={{fontFamily:M,fontSize:"0.52rem",color:t.muted,letterSpacing:"0.1em"}}>{p.weeks}</div>
              </div>
            </div>
            <div style={{fontFamily:M,fontSize:"0.6rem",color:t.text2,marginBottom:"0.6rem"}}>{p.focus}</div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
              {p.goals.map((g,i)=>(
                <div key={i} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <div style={{width:5,height:5,background:p.color,borderRadius:"50%",flexShrink:0,marginTop:"0.32rem"}}/>
                  <div style={{fontFamily:M,fontSize:"0.58rem",color:t.text2,lineHeight:1.5}}>{g}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{fontFamily:F,fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:t.text,marginBottom:"0.75rem"}}>PROGRESSIVE OVERLOAD RULES</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
        {RULES.map(r=>(
          <div key={r.rule} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:6,padding:"0.75rem 1rem"}}>
            <div style={{fontFamily:F,fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.accent,marginBottom:"0.25rem"}}>{r.rule}</div>
            <div style={{fontFamily:M,fontSize:"0.6rem",color:t.text2,lineHeight:1.5}}>{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MEALS PAGE ────────────────────────────────────────────────────────────────
function MealsPage({t}){
  const F="'Rajdhani',sans-serif";
  const M="'Share Tech Mono',monospace";
  const [activeDay,setActiveDay]=useState(0);
  const MEAL_PLAN=[
    {day:"MON",tag:"LIFT DAY",meals:[
      {label:"Breakfast",items:["3 scrambled eggs","2 slices wholegrain toast","Handful baby spinach","Black coffee or green tea"],protein:28,kcal:380},
      {label:"Snack",items:["Greek yogurt (200g)","Handful mixed berries"],protein:15,kcal:160},
      {label:"Lunch",items:["Tuna (1 tin, in water)","Brown rice (150g cooked)","Cucumber + tomato salad","1 tsp olive oil + lemon"],protein:38,kcal:460},
      {label:"Snack",items:["2 boiled eggs","Apple"],protein:13,kcal:180},
      {label:"Dinner",items:["Grilled chicken breast (150g)","Roasted sweet potato (200g)","Steamed broccoli + courgette","Lemon + herbs"],protein:40,kcal:430},
    ]},
    {day:"TUE",tag:"SWIM DAY",meals:[
      {label:"Breakfast",items:["Oats (60g)","Protein powder (1 scoop)","Almond milk","Banana (sliced)"],protein:30,kcal:400},
      {label:"Pre-swim snack",items:["Handful almonds (20g)","Orange"],protein:6,kcal:190},
      {label:"Post-swim lunch",items:["Tuna (1 tin)","Chickpeas (150g)","Mixed greens","Red onion + balsamic"],protein:42,kcal:450},
      {label:"Snack",items:["Cottage cheese (150g)","Cucumber slices"],protein:18,kcal:155},
      {label:"Dinner",items:["Salmon fillet (150g)","Quinoa (100g cooked)","Asparagus","Lemon butter"],protein:42,kcal:480},
    ]},
    {day:"WED",tag:"LIFT DAY",meals:[
      {label:"Breakfast",items:["3-egg omelette","Feta (30g)","Cherry tomatoes","Wholegrain pita"],protein:30,kcal:390},
      {label:"Snack",items:["Greek yogurt (150g)","1 tbsp honey","Walnuts (15g)"],protein:14,kcal:200},
      {label:"Lunch",items:["Tuna (1 tin)","Lentil soup (350ml)","Bread roll (1 small)","Side salad"],protein:36,kcal:470},
      {label:"Snack",items:["Protein shake","Handful mixed nuts"],protein:25,kcal:220},
      {label:"Dinner",items:["Chicken thigh (150g, grilled)","Brown rice (100g cooked)","Roasted peppers + onion"],protein:38,kcal:440},
    ]},
    {day:"THU",tag:"RUN DAY",meals:[
      {label:"Pre-run breakfast",items:["Banana","Peanut butter (1 tbsp)","Black coffee"],protein:5,kcal:200},
      {label:"Post-run meal",items:["3 eggs any style","Avocado (½)","Sourdough (1 slice)","Tomatoes"],protein:24,kcal:420},
      {label:"Lunch",items:["Tuna (1 tin)","Pasta (100g cooked)","Olive oil + garlic","Cherry tomatoes","Parmesan (light)"],protein:40,kcal:500},
      {label:"Snack",items:["Boiled egg (2)","Apple"],protein:13,kcal:185},
      {label:"Dinner",items:["Grilled fish (150g)","Sweet potato mash (180g)","Green beans","Lemon + dill"],protein:38,kcal:420},
    ]},
    {day:"FRI",tag:"LIFT DAY",meals:[
      {label:"Breakfast",items:["3 eggs scrambled","Greek yogurt (100g)","Berries","Green tea"],protein:30,kcal:360},
      {label:"Pre-workout snack",items:["Banana","Rice cake (2)"],protein:3,kcal:170},
      {label:"Post-workout lunch",items:["Tuna (1 tin)","Chickpea + spinach salad","Brown rice (100g)","Tahini dressing"],protein:42,kcal:480},
      {label:"Snack",items:["Protein shake","Almonds (20g)"],protein:28,kcal:230},
      {label:"Dinner",items:["Beef mince (150g, lean)","Courgette noodles","Tomato sauce (homemade)","Parmesan (10g)"],protein:38,kcal:430},
    ]},
    {day:"SAT",tag:"RECOVERY",meals:[
      {label:"Breakfast",items:["Shakshuka (3 eggs)","Wholegrain bread (2 slices)","Fresh herbs"],protein:25,kcal:400},
      {label:"Snack",items:["Fruit salad","Greek yogurt (150g)"],protein:12,kcal:200},
      {label:"Lunch",items:["Falafel (6 pieces)","Hummus","Pita","Fattoush salad"],protein:22,kcal:550},
      {label:"Treat — dinner",items:["Your choice — enjoy mindfully","Eat slowly, savour it","No guilt. This is sustainable eating."],protein:0,kcal:0},
    ]},
    {day:"SUN",tag:"RESET",meals:[
      {label:"Brunch",items:["2-egg omelette","Mushrooms + spinach","Wholegrain toast (1)","Orange juice"],protein:22,kcal:350},
      {label:"Light lunch",items:["Lentil soup (400ml)","Bread (1 piece)","Yogurt"],protein:20,kcal:380},
      {label:"Snack",items:["Fruit (any)","Handful nuts"],protein:5,kcal:180},
      {label:"Dinner",items:["Meal prep: chicken + rice + roasted veg","Cook double quantities","Pack for Mon–Wed lunches"],protein:38,kcal:450},
    ]},
  ];
  const md=MEAL_PLAN[activeDay];
  const totalP=md.meals.reduce((s,m)=>s+(m.protein||0),0);
  const totalK=md.meals.reduce((s,m)=>s+(m.kcal||0),0);
  return(
    <div style={{padding:"1.5rem 1rem 7rem",maxWidth:540,margin:"0 auto"}}>
      <div style={{fontFamily:F,fontSize:"clamp(1.5rem,5vw,2.2rem)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text,marginBottom:"0.25rem"}}>MEAL PLAN</div>
      <div style={{fontFamily:M,fontSize:"0.58rem",color:t.muted,letterSpacing:"0.15em",marginBottom:"1.2rem"}}>// 7-DAY F1 NUTRITION //</div>

      <div style={{display:"flex",gap:"0.3rem",overflowX:"auto",paddingBottom:"0.5rem",marginBottom:"1.2rem",scrollbarWidth:"none"}}>
        {MEAL_PLAN.map((d,i)=>(
          <button key={d.day} onClick={()=>setActiveDay(i)}
            style={{flexShrink:0,padding:"0.5rem 0.75rem",background:activeDay===i?t.accent:"transparent",color:activeDay===i?"#fff":t.muted,border:`1.5px solid ${activeDay===i?t.accent:t.border}`,borderRadius:5,cursor:"pointer",fontFamily:F,fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.15s"}}>
            {d.day}
          </button>
        ))}
      </div>

      <div style={{background:t.surface,border:`1px solid ${t.accent}44`,borderRadius:8,padding:"0.85rem 1rem",marginBottom:"1.2rem",display:"flex",gap:"1.5rem",alignItems:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:"1.8rem",fontWeight:700,color:t.accent,lineHeight:1}}>{totalP}g</div>
          <div style={{fontFamily:M,fontSize:"0.48rem",color:t.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Protein</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:F,fontSize:"1.8rem",fontWeight:700,color:"#ffd166",lineHeight:1}}>{totalK}</div>
          <div style={{fontFamily:M,fontSize:"0.48rem",color:t.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Calories</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:F,fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:t.text}}>{md.day} — {md.tag}</div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
        {md.meals.map((meal,i)=>(
          <div key={i} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:7,padding:"0.85rem 1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
              <div style={{fontFamily:F,fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:t.accent}}>{meal.label}</div>
              {meal.protein>0&&<div style={{fontFamily:M,fontSize:"0.5rem",color:t.muted}}>{meal.protein}g · {meal.kcal}kcal</div>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.2rem"}}>
              {meal.items.map((item,j)=>(
                <div key={j} style={{display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <div style={{width:4,height:4,background:t.accent,borderRadius:"50%",flexShrink:0,marginTop:"0.35rem",opacity:0.6}}/>
                  <div style={{fontFamily:M,fontSize:"0.6rem",color:t.text2,lineHeight:1.4}}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const [themeKey,setThemeKey]=useState(()=>localStorage.getItem("f1_theme")||"dark");
  const t=THEMES[themeKey];
  const toggleTheme=()=>{const next=themeKey==="dark"?"light":"dark";setThemeKey(next);localStorage.setItem("f1_theme",next);};
  const [page,setPage]=useState("home");

  const NAV_ITEMS=[
    {id:"home",icon:"⬡",label:"Home"},
    {id:"workouts",icon:"◈",label:"Train"},
    {id:"tracker",icon:"⊞",label:"Track"},
    {id:"meals",icon:"◉",label:"Meals"},
    {id:"more",icon:"⊕",label:"More"},
  ];
  const MORE_ITEMS=[
    {id:"measurements",label:"Measurements"},
    {id:"quran",label:"Quran"},
    {id:"progression",label:"Progression"},
    {id:"pillars",label:"Pillars"},
  ];
  const [showMore,setShowMore]=useState(false);

  const handleNav=(id)=>{
    if(id==="more"){setShowMore(s=>!s);return;}
    setShowMore(false);setPage(id);
  };
  const handleMore=(id)=>{setPage(id);setShowMore(false);};

  const F="'Rajdhani',sans-serif";

  // ── HERO / HOME PAGE ──────────────────────────────────────────────────────
  function HomePage(){
    const today=new Date();
    const dayIdx=today.getDay();
    const sched=WEEKLY_SCHEDULE[dayIdx===0?6:dayIdx-1];
    const greeting=today.getHours()<12?"Good morning":today.getHours()<17?"Good afternoon":"Good evening";
    const dayName=DAY_FULL[today.getDay()];
    const dateStr=`${dayName}, ${MONTHS[today.getMonth()]} ${today.getDate()}`;
    const M2="'Share Tech Mono',monospace";
    return(
      <div style={{minHeight:"100vh",background:t.bg,position:"relative",overflow:"hidden"}}>
        {/* Animated background grid */}
        <div style={{position:"fixed",inset:0,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 50px,${t.accent}06 50px,${t.accent}06 51px),repeating-linear-gradient(90deg,transparent,transparent 50px,${t.accent}06 50px,${t.accent}06 51px)`,pointerEvents:"none",zIndex:0}}/>
        {/* Hero */}
        <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"2rem 1.5rem",textAlign:"center"}}>
          <div style={{fontFamily:M2,fontSize:"0.55rem",letterSpacing:"0.35em",color:t.accent,textTransform:"uppercase",marginBottom:"1rem",animation:"fadeUp 0.6s ease 0.1s both"}}>{greeting} · {dateStr}</div>
          <div style={{fontFamily:F,fontSize:"clamp(3.5rem,16vw,9rem)",fontWeight:700,lineHeight:0.85,letterSpacing:"0.04em",textTransform:"uppercase",animation:"fadeUp 0.6s ease 0.25s both"}}>
            <div style={{color:t.text}}>YOUR</div>
            <div style={{color:t.accent,WebkitTextStroke:`1px ${t.accent}`,display:"flex",alignItems:"center",gap:"0.1em"}}>
              <span>F</span><span style={{color:t.accent,opacity:0.3}}>1</span>
            </div>
            <div style={{color:t.text}}>ERA</div>
          </div>
          <div style={{fontFamily:M2,fontSize:"0.62rem",color:t.muted,marginTop:"1.5rem",letterSpacing:"0.15em",animation:"fadeUp 0.6s ease 0.4s both",maxWidth:280}}>
            Faster. Stronger. Sharper.
          </div>

          {/* Today's session card */}
          <div style={{marginTop:"2rem",width:"100%",maxWidth:340,background:t.surface,border:`1px solid ${t.accent}44`,borderRadius:10,padding:"1.25rem",animation:"fadeUp 0.6s ease 0.55s both",cursor:"pointer",transition:"border-color 0.2s"}}
            onClick={()=>setPage("workouts")}
            onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=t.accent+"44"}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
              <div>
                <div style={{fontFamily:M2,fontSize:"0.5rem",letterSpacing:"0.2em",color:t.muted,textTransform:"uppercase",marginBottom:"0.2rem"}}>Today's Session</div>
                <div style={{fontFamily:F,fontSize:"1.1rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.text}}>{sched?.label||"Rest Day"}</div>
              </div>
              <div style={{background:t.accent+"22",border:`1px solid ${t.accent}44`,borderRadius:4,padding:"0.2rem 0.5rem",fontFamily:F,fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent}}>{sched?.type||"REST"}</div>
            </div>
            <div style={{fontFamily:M2,fontSize:"0.55rem",color:t.accent,letterSpacing:"0.12em"}}>→ TAP TO OPEN WORKOUT</div>
          </div>

          {/* Manifesto */}
          <div style={{marginTop:"2rem",maxWidth:360,animation:"fadeUp 0.6s ease 0.7s both"}}>
            <div style={{fontFamily:F,fontSize:"0.55rem",letterSpacing:"0.3em",color:t.accent,textTransform:"uppercase",marginBottom:"0.75rem"}}>// THE MISSION //</div>
            <div style={{fontFamily:M2,fontSize:"0.62rem",color:t.muted,lineHeight:1.8,textAlign:"left"}}>
              {`You are building a body that is capable of the most demanding sport on earth. Every session compounds. Every meal matters. Every night of sleep is engineering.`.split(" ").map((w,i)=><span key={i} style={{color:["sport","compounds","engineering"].includes(w.replace(/[.,]/g,""))?t.accent:t.muted}}>{w} </span>)}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{display:"flex",gap:"1rem",marginTop:"2rem",animation:"fadeUp 0.6s ease 0.85s both"}}>
            {[{v:"7",u:"Sessions/Week"},{v:"40",u:"Week Program"},{v:"6",u:"Pillars"}].map(s=>(
              <div key={s.u} style={{textAlign:"center"}}>
                <div style={{fontFamily:F,fontSize:"1.8rem",fontWeight:700,color:t.accent,lineHeight:1}}>{s.v}</div>
                <div style={{fontFamily:M2,fontSize:"0.45rem",color:t.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>{s.u}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div style={{position:"absolute",bottom:"2rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem",animation:"fadeUp 0.6s ease 1.1s both"}}>
            <div style={{fontFamily:M2,fontSize:"0.48rem",letterSpacing:"0.3em",color:t.muted,textTransform:"uppercase"}}>scroll</div>
            <div style={{width:1,height:35,background:`linear-gradient(to bottom, ${t.accent}, transparent)`,animation:"pulse 2s ease-in-out infinite"}}/>
          </div>
        </div>
      </div>
    );
  }

  const pageMap={
    home:<HomePage/>,
    workouts:<WorkoutsPage t={t}/>,
    tracker:<TrackerPage t={t}/>,
    meals:<MealsPage t={t}/>,
    measurements:<MeasurementsPage t={t}/>,
    quran:<QuranPage t={t}/>,
    progression:<ProgressionPage t={t}/>,
    pillars:<PillarsPage t={t}/>,
  };

  return(
    <div style={{background:t.bg,minHeight:"100vh",color:t.text,fontFamily:F,transition:"background 0.3s, color 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&family=Share+Tech+Mono&family=Noto+Naskh+Arabic&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${t.accent}44;border-radius:4px;}
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      {/* TOP NAV */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,height:48,background:t.navBg,backdropFilter:"blur(14px)",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1rem"}}>
        <div style={{fontFamily:F,fontSize:"1.2rem",fontWeight:700,letterSpacing:"0.2em",color:t.accent,textTransform:"uppercase"}}>F1 ERA</div>
        <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
          <button onClick={toggleTheme}
            style={{background:"transparent",border:`1px solid ${t.border}`,borderRadius:4,padding:"0.25rem 0.6rem",cursor:"pointer",color:t.text2,fontSize:"0.7rem",fontFamily:F,fontWeight:700,letterSpacing:"0.1em",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.text2;}}>
            {themeKey==="dark"?"☀ LIGHT":"◑ DARK"}
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{paddingTop:48}}>
        {pageMap[page]||<HomePage/>}
      </div>

      {/* MORE DRAWER */}
      {showMore&&(
        <div style={{position:"fixed",bottom:60,left:0,right:0,zIndex:998,background:t.navBg,backdropFilter:"blur(14px)",borderTop:`1px solid ${t.border}`,padding:"0.75rem 1rem",display:"flex",gap:"0.5rem",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp 0.2s ease"}}>
          {MORE_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>handleMore(item.id)}
              style={{padding:"0.5rem 1rem",background:page===item.id?t.accent:"transparent",color:page===item.id?"#fff":t.text2,border:`1.5px solid ${page===item.id?t.accent:t.border}`,borderRadius:6,cursor:"pointer",fontFamily:F,fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",transition:"all 0.15s"}}
              onMouseEnter={e=>{if(page!==item.id){e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.color=t.accent;}}}
              onMouseLeave={e=>{if(page!==item.id){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.text2;}}}>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:999,height:60,background:t.navBg,backdropFilter:"blur(14px)",borderTop:`1px solid ${t.border}`,display:"flex",alignItems:"stretch"}}>
        {NAV_ITEMS.map(item=>{
          const isActive=item.id==="more"?showMore:page===item.id&&!showMore;
          return(
            <button key={item.id} onClick={()=>handleNav(item.id)}
              style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"0.15rem",background:"transparent",border:"none",cursor:"pointer",position:"relative",transition:"all 0.15s"}}>
              {isActive&&<div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:t.accent,borderRadius:2}}/>}
              <div style={{fontSize:"1rem",opacity:isActive?1:0.4,transition:"opacity 0.15s"}}>{item.icon}</div>
              <div style={{fontFamily:F,fontSize:"0.48rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:isActive?t.accent:t.muted,transition:"color 0.15s"}}>{item.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
