import Journey_hero from "../components/techwizjourney/Journey_hero"
import OurProject from "../components/techwizjourney/OurProject"
import TheTeam from "../components/techwizjourney/TheTeam"
import WhereStarted from "../components/techwizjourney/WhereStarted"
import Preparing_for_Techwiz from "../components/techwizjourney/Preparing_for_Techwiz"
// import Journey_Nav from "../components/techwizjourney/journey_Nav"
import "../styles/TechwizJourney.css"
import TechwizSelection from "../components/techwizjourney/TechwizSelection"
import WhatWeLearned from "../components/techwizjourney/What_We_Learned"

const TechwizJourney = () => {
  return (
    <div id="TechwizJourney">
       {/* <Journey_Nav/> */}
       <Journey_hero/>
       <TheTeam/>
       <WhereStarted /> 
       <OurProject/>
       {/* Rafay  */}
       <Preparing_for_Techwiz/>
       {/* Damsa  */}
      <TechwizSelection/>
      {/* YOusra  */}
       <WhatWeLearned /> 

       {/* <SelectionTechwiz/> */}
    </div>
  )
}

export default TechwizJourney
