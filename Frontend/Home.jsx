import  './Home.scss'
import Footer from './Footer/Footer'
import Header from '../Frontend/Header/Header'
import Mainsrc from '../src/assets/home.jpg'

const Home = () => {
  return (
    <div>
      <Header/>
      <div className="homecontainer">

        <div className="imgcontainer">
        <img src={Mainsrc}  />
        </div>
      </div>
      
      <Footer/>
    </div>
  )
}

export default Home