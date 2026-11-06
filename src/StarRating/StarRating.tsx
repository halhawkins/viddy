import { type FC } from 'react';
import './StarRating.css';

interface StarRatingProps {
    value: number;
    range?: readonly [min: number, max: number];
}

const STAR_COUNT = 5;

export const StarRating: FC<StarRatingProps> = ({ value, range = [0, 10] }) => {
    const [min, max] = range;

    if (!Number.isFinite(value)) {
        throw new RangeError('StarRating value must be a finite number.');
    }

    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
        throw new RangeError('StarRating range must contain finite values with max greater than min.');
    }

    const rating = Math.round(
        Math.min(1, Math.max(0, (value - min) / (max - min))) * STAR_COUNT * 2,
    ) / 2;

    return (
        <div className="star-rating" role="img" aria-label={`${rating} out of ${STAR_COUNT} stars`}>
            {Array.from({ length: STAR_COUNT }, (_, index) => {
                const starValue = index + 1;
                const fill = rating >= starValue ? 'full' : rating >= starValue - 0.5 ? 'half' : 'empty';

                return (
                    <span className={`star-rating__star star-rating__star--${fill}`} key={index}>
                        ★
                    </span>
                );
            })}
        </div>
    );
};
