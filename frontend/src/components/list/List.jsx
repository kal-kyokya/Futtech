// --- frontend/src/components/list/List.jsx ---

import './list.scss';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItem from '../listItem/ListItem';
import { useRef, useState } from 'react';

const List = ({ list }) => {
    const listRef = useRef();
    const [ slideNumber, setSlideNumber ] = useState(0);
    const [ isMoved, setIsMoved ] = useState(false);

    // Determine how many items are visible at once to adjust slide step
    const getVisibleItemsCount = () => {
	if (!listRef.current) return 1; // Default to 1 if ref not ready

	const containerWidth = listRef.current.parentElement.getBoundingClientRect().width;
	// More reliably, get the first item's actual computed width
	if (listRef.current.children.length > 0) {
	    const firstItem = listRef.current.children[0];
	    const itemWidth = firstItem.offsetWidth;
	    const computedStyle = window.getComputedStyle(firstItem);
	    const itemMarginRight = parseFloat(computedStyle.marginRight);
	    const totalItemWidth = itemWidth + itemMarginRight;

	    // Calculate how many items fit in the current container width
	    // We will floor it since it can be a floating point number
	    return Math.floor(containerWidth / totalItemWidth);
	}
	return 1; // Fallback
    }

    const handleClick = (direction) => {
	setIsMoved(true);
	const containerWidth = listRef.current.parentElement.getBoundingClientRect().width;

	// Get the current left position of the container
	let currentTransformX = parseFloat(
	    listRef.current.style.transform.replace(
		'translateX(', ''
	    ).replace(
		'px)', ''
	    ) || '0'
	);

	// Dynamically calculate the step based on visible items
	const visibleItems = getVisibleItemsCount();
	if (visibleItems == 0) return; // Avoid division by zero or invalid calculations

	const firstItem = listRef.current.children[0];
	if (!firstItem) return; // No items to slide

	const itemWidth = firstItem.offsetWidth;
	const computedStyle = window.getComputedStyle(firstItem);
	const itemMarginRight = parseFloat(computedStyle.marginRight);
	const totalItemWidth = itemWidth + itemMarginRight;

	const slideStep = totalItemWidth; // Slide one item at a time

	// Make transform relative to its initial position
	let distanceToContainerEdge = listRef.current.getBoundingClientRect().x - listRef.current.parentElement.getBoundingClientRect().x;

	// Calculate the 'delta' (change) needed
	let newTransformX = currentTransformX;

	if (direction === 'right' && slideNumber <= list.content.length - visibleItems) {
	    setSlideNumber(slideNumber + 1);
	    newTransformX = currentTransformX - slideStep; // Move left (show next)

	    // Ensure we don't slide too far right, leaving blank space
	    const totalContentWidth = list.content.length * totalItemWidth;
	    const maxNegativeTransform = -(totalContentWidth - containerWidth);

	    if (newTransformX < maxNegativeTransform) {
		newTransformX = maxNegativeTransform;
	    }
	}

	if (direction === 'left' && slideNumber > 0) {
	    setSlideNumber(slideNumber - 1);
	    newTransformX = currentTransformX + slideStep; // Move right (show previous)

	    // Ensure we don't slide past the initial position (0 or initial maargin offset)
	    const initialMarginLeft = parseFloat(window.getComputedStyle(listRef.current).marginLeft);

	    if (newTransformX > initialMarginLeft) {
		newTransformX = 0;
	    }
	}

	// Apply the new transform
	listRef.current.style.transform = `translateX(${newTransformX}px)`;
    }

    return (
	<div className='list'>
	    <span className='listTitle'> { list.title } </span>

	    <div className='wrapper'>
		<ArrowBackIosNewIcon className='sliderArrow left'
				     onClick={ () => handleClick('left') }
				     style={{ display: slideNumber === 0 && !isMoved ? 'none' : 'flex' }}
		/>

		<div className='container' ref={listRef}>
		    {
			Array.isArray(list.content) && list.content.map((videoId, index) => {
			    return (
				<ListItem videoId={ videoId }
					  index={ index }
					  key={ index }
				/>
			    )
			})
		    }
		</div>

		<ArrowForwardIosIcon className='sliderArrow right'
				     onClick={ () => handleClick('right') }
				     style={{ display: slideNumber >= list.content.length - getVisibleItemsCount() ? 'none' : 'flex' }}
		/>
	    </div>
	</div>
    );
};

export default List;
