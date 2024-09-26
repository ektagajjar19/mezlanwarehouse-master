import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { Banner, Slideout, useMediaQuery, ControllerProvider, useIntersection } from '@searchspring/snap-preact-components';

import { Results, NoResults } from './Results';
import { SortBy } from './SortBy';
import { CustomFacets } from './Facets';
import { FilterSummary } from './FilterSummary';
import { Pagination } from './Pagination';
import { useRef } from 'preact/hooks';

export const Content = observer((props) => {
	const controller = props.controller;
	const {
		store,
		store: { pagination, merchandising, loading },
	} = controller;

	const isMobile = useMediaQuery('(max-width: 767px)');
	const infinite = useRef(null);
	const atBottom = pagination.totalResults > 0 ? useIntersection(infinite, '50px') : false;
	if (atBottom && pagination.next && !loading) {
		setTimeout(() => {
			pagination.next.url.go({ history: 'replace' });
		});
	}

	return (
		controller.store.loaded && (
			<ControllerProvider controller={controller}>
				<div className='site_ss__sidebar'>
					<FilterSummary />
				</div>
				<div className="ss__content">
					<Banner content={merchandising.content} type="header" />
					<Banner content={merchandising.content} type="banner" />

					{pagination.totalResults > 0 ? (
						<div>
							{isMobile && store.facets.length && store.pagination.totalResults && (
								<Slideout buttonContent={<SlideoutButton />}>
									<SlideoutContent />
								</Slideout>
							)}

							<SortBy />
							<div className='mob-flt'>
								<div className='mobile_ss__sidebar'>
									<FilterSummary />
								</div>
								<Results results={store.results}></Results>
							</div>

							{/* <Pagination pagination={store.pagination} /> */}
							<div style={{ display: loading ? 'none' : 'block' }} ref={infinite}></div>
						</div>
					) : (
						pagination.totalResults === 0 && <NoResults />
					)}

					<Banner content={merchandising.content} type="footer" />
				</div>
			</ControllerProvider>
		)
	);
});

const SlideoutButton = () => {
	return <button>Filters</button>;
};

const SlideoutContent = (props) => {
	const { toggleActive, active } = props;

	return (
		active && (
			<>
				{/* slideout content here */}
				<FilterSummary />
				<CustomFacets />
			</>
		)
	);
};
