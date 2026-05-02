export const QUESTIONS = [
  {sec:'Study Regularity',q:'How many days per week do you study?',opts:['1-2 days','3-4 days','5-6 days','Every day'],sc:[1,2,3,4],key:'Ds'},
  {sec:'Study Regularity',q:'How many hours do you study per day?',opts:['Less than 1 hour','1-2 hours','3-4 hours','More than 4 hours'],sc:[1,2,3,4],key:'Hs'},
  {sec:'Study Regularity',q:'Do you follow a study schedule or timetable?',opts:['Yes','No'],sc:[4,1],key:'schedule'},
  {sec:'Study Regularity',q:'How often do you skip planned study sessions?',opts:['Never','Rarely','Sometimes','Often'],sc:[4,3,2,1],key:'skip'},
  {sec:'Study Habits',q:'When do you usually study?',opts:['Morning','Afternoon','Night','No fixed time'],sc:[4,3,3,1],key:'time'},
  {sec:'Study Habits',q:'What method do you mainly use for studying?',opts:['Reading notes','Watching videos','Practicing questions','Group study'],sc:[3,2,4,3],key:'method'},
  {sec:'Study Habits',q:'Do you set study goals before starting?',opts:['Always','Sometimes','Never'],sc:[4,2,1],key:'Gc'},
  {sec:'Progress Tracking',q:'Do you track your study progress?',opts:['Yes, regularly','Sometimes','No'],sc:[4,2,1],key:'track'},
  {sec:'Progress Tracking',q:'How often do you review what you have learned?',opts:['Daily','Weekly','Before exams only','Never'],sc:[4,3,2,1],key:'review'},
  {sec:'Progress Tracking',q:'Do your study habits improve academic performance?',opts:['Strongly agree','Agree','Neutral','Disagree'],sc:[4,3,2,1],key:'perf'},
  {sec:'Challenges',q:'How often do you feel distracted while studying?',opts:['Never','Rarely','Sometimes','Often'],sc:[4,3,2,1],key:'distract'},
  {sec:'Challenges',q:'What is your biggest study challenge?',opts:['Lack of time','Lack of motivation','Distractions','Stress'],sc:[2,2,2,2],key:'challenge'},
  {sec:'Improvement',q:'Would you like a tool to track your study habits?',opts:['Yes, definitely','Maybe','No'],sc:[4,2,1],key:'want'},
  {sec:'Improvement',q:'Can tracking habits improve your results?',opts:['Yes','Not sure','No'],sc:[4,2,1],key:'belief'},
]
export const SECTIONS = [...new Set(QUESTIONS.map(q=>q.sec))]
export const SEC_COLOR  = {'Study Regularity':'#dbeafe','Study Habits':'#e0f2fe','Progress Tracking':'#ede9fe','Challenges':'#ffedd5','Improvement':'#dcfce7'}
export const SEC_ACCENT = {'Study Regularity':'#1d4ed8','Study Habits':'#0f766e','Progress Tracking':'#6d28d9','Challenges':'#c2410c','Improvement':'#15803d'}
export function computeScores(a) {
  const get = k => { const i=QUESTIONS.findIndex(q=>q.key===k); return i>=0&&a[i]!=null?QUESTIONS[i].sc[a[i]]:2 }
  const HTS=Math.round((get('Ds')/4)*100), SIS=Math.round((get('Hs')/4)*100)
  const GCS=Math.round((get('Gc')/4)*100), QPS=Math.round(((get('review')+get('perf'))/8)*100)
  return {HTS,SIS,GCS,QPS,PS:Math.round(0.3*HTS+0.2*SIS+0.2*GCS+0.3*QPS)}
}
