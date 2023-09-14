import Slider from "react-slick";
import carousel01 from '../../assets/images/carousel/1.jpg'
import carousel02 from '../../assets/images/carousel/2.jpg'
import carousel03 from '../../assets/images/carousel/3.jpg'
import carousel04 from '../../assets/images/carousel/4.jpg'
const settings = {
  dots: false,
  autplay: true,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const CarouselCard = () => (
  <Slider autoplay {...settings}>
    <div>
      <img src={carousel02} className='w-100 h-100 object-fit-cover'/>
    </div>
    <div>
      <img src={carousel03} className='w-100 h-100 object-fit-cover'/>
    </div>
    <div>
      <img src={carousel01} className='w-100 h-100 object-fit-cover'/>
    </div>
    <div>
      <img src={carousel04} className='w-100 h-100 object-fit-cover'/>
    </div>
  </Slider>
);
export default CarouselCard;