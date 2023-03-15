import { Carousel } from 'antd';
import carousel01 from '../../assets/images/carousel/1.jpg'
import carousel02 from '../../assets/images/carousel/2.jpg'
import carousel03 from '../../assets/images/carousel/3.jpg'
import carousel04 from '../../assets/images/carousel/4.jpg'
const contentStyle = {
  height: '206px',
  color: '#fff',
  maxWidth: '100%',
  width: 'auto',
  margin:'auto',
  display:'block'
};
const CarouselCard = () => (
  <Carousel autoplay>
    <div style={contentStyle}>
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
  </Carousel>
);
export default CarouselCard;