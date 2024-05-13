import  './Home.scss'
import '../Frontend/Men.css'
import Footer from './Footer/Footer'
import Header from '../Frontend/Header/Header'
import Mainsrc from '../src/assets/home.jpg'
import HomeMen from './Home/HomeMen'
import HomeWomen from './Home/HomeWomen'

const Home = () => {
  return (
    <div>
      <Header/>
      <div className="homecontainer">

        <div className="imgcontainer">
        <img src={Mainsrc}  />
        </div>
      </div>


      <div className="homemen">

        <h4>Men's Collection</h4>
        <HomeMen/>
        
      </div>

      <div className="homewomen">

        <h4>Women's Collection</h4>
        <HomeWomen/>
        
      </div>
      
      
      <Footer/>
    </div>
  )
}

export default Home