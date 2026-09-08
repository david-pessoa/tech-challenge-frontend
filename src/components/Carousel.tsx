import styled from 'styled-components';

import { Autoplay, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useScreenWidth } from '../hooks/screenWidth';

import CarouselCard from './CarouselCard';

import 'swiper/css';
import '../styles/swiper-style.css';
import type { Post } from '../types/Posts';

const Link = styled.a`
  display: block;
`;

type CarouselProps = {
  newPosts: Post[];
  isAdmin: boolean;
};

export default function Carousel({ newPosts, isAdmin }: CarouselProps) {
  const screenWidth = useScreenWidth();

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={12}
      slidesPerView="auto"
      loop={true}
      pagination={{ clickable: true }}
      navigation
      className={isAdmin ? 'isAdmin' : ''}
    >
      {newPosts.map((dado: Post, i) => (
        <SwiperSlide key={i} style={{ width: screenWidth >= 900 ? '12.5rem' : '9.875rem'}}>
          <Link href={`/post/${dado.postId}`}>
            <CarouselCard dado={dado} />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
