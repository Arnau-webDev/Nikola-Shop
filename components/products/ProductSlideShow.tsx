import { Slide } from 'react-slideshow-image';

import styles from './ProductSlideShow.module.css';
import 'react-slideshow-image/dist/styles.css';

interface Props {
    images: string[]
}

export const ProductSlideShow: React.FC<Props> = ({ images }) => {
	return (
		<Slide
			easing='ease'
			duration={7000}
			indicators
		>
			{
				images.map(img => {
					return (
						<div className={styles['each-slide']} key={img}>
							<div style={{
								backgroundImage: `url(${img})`,
								backgroundSize: 'cover'
							}}>

							</div>
						</div>
					);
				})
			}   
		</Slide>
	);
};
