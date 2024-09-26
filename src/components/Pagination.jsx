// import { h, Fragment } from 'preact';
// import { observer } from 'mobx-react';
// import { withController } from '@searchspring/snap-preact-components';

// export const Pagination = withController(
// 	observer((props) => {
// 		const controller = props.controller;
// 		const {
// 			store: { pagination },
// 		} = controller;
// 		const pages = pagination.getPages(5);

// 		return (
// 			<div className="ss__pagination">
// 				{pagination.previous && (
// 					<span className="ss__pagination__page--previous">
// 						<a {...pagination.previous.url.link} title="Previous">
// 							Prev
// 						</a>
// 					</span>
// 				)}

// 				{pages.map((page) => (
// 					<span className={`ss__pagination__page ${page.active ? 'ss__pagination__page--current' : ''}`}>
// 						<a {...page.url.link}>{page.number}</a>
// 					</span>
// 				))}

// 				{pagination.next && (
// 					<span className="ss__pagination__page--next">
// 						<a {...pagination.next.url.link} title="Next">
// 							Next
// 						</a>
// 					</span>
// 				)}
// 			</div>
// 		);
// 	})
// );


/* external imports */
import { h, Fragment, Component } from 'preact';

/* searchspring imports */
import { withController } from '@searchspring/snap-preact-components';

export const Pagination = withController((props) => {
	const { controller } = props;
	const store = controller.store;
	const { pagination } = store;

	// variables for pagination construction
	const pagesLimit = 5;
	const pagesCheck = Math.floor(pagesLimit / 2);
	const pages = pagination.getPages(pagesLimit);

	// checks for visbility of first and last page spans
	const pagesFirstLast = pagination.totalPages > pagesLimit;
	const pagesFirst = (modifier) => {
		return pagination.page - modifier > pagesCheck;
	};
	const pagesLast = (modifier) => {
		return pagination.page < pagination.totalPages - (pagesCheck + modifier);
	};

	const infiniteEnabled = true;
	const progress = (pagination.end / pagination.totalResults) * 100;

	return (
		<>
			{infiniteEnabled ? (
				pagination.next ? (
					<div class="pagination-wrapper">
						<nav class="pagination infinite">
							<div class="ss-infinite-loadmore">
								<div class="progress-bar">
									<span class="progress-bar__text">
										SHOWING {pagination.end} of {pagination.totalResults}
									</span>

									<div class="progress-bar__progress">
										<span class="progress-bar__progress-inner" style={`width: ${progress}%`}></span>
									</div>
								</div>
								<button class="button--black" type="button" onClick={(e) => pagination.next.url.link.onClick(e)}>
									<span class="link__target">LOAD MORE</span>
								</button>
							</div>
						</nav>
					</div>
				) : null
			) : (
				<>
					
					<div class="pagination-wrapper">
						<nav class="pagination" role="navigation" aria-label="Pagination">
							<ul class="pagination__list list-unstyled" role="list">
								{pagination.previous ? (
									<li>
										<a
											class="pagination__item pagination__item--next pagination__item-arrow link motion-reduce"
											aria-label="Previous page"
											{...pagination.previous.url.link}
										>
											<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
													fill="currentColor"
												></path>
											</svg>
										</a>
									</li>
								) : null}

								{pagesFirstLast && pagesFirst(1) && (
									<>
										<li>
											<a
												role="link"
												aria-disabled="false"
												class="pagination__item light"
												aria-current="page"
												aria-label="Page 1"
												{...pagination.first.url.link}
											>
												{pagination.first.number}
											</a>
										</li>

										{pagesFirst(2) && <PaginationHellip />}
									</>
								)}

								{pages.map((page) => (
									<li>
										<a
											role="link"
											aria-disabled={page.active ? true : false}
											class={`pagination__item light${page.active ? ' pagination__item--current' : ''}`}
											aria-current="page"
											aria-label={`Page ${page.number}`}
											{...page.url.link}
										>
											{page.number}
										</a>
									</li>
								))}

								{pagesFirstLast && pagesLast(0) && (
									<>
										{pagesLast(1) && <PaginationHellip />}
										<li>
											<a class="pagination__item link" aria-label="Page 64" {...pagination.last.url.link}>
												{pagination.last.number}
											</a>
										</li>
									</>
								)}

								{pagination.next ? (
									<li>
										<a
											class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce"
											aria-label="Next page"
											{...pagination.next.url.link}
										>
											<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
													fill="currentColor"
												/>
											</svg>
										</a>
									</li>
								) : null}
							</ul>
						</nav>
					</div>
				</>
			)}
		</>
	);
});

export const PaginationHellip = () => {
	return (
		<li>
			<span class="pagination__item">&hellip;</span>
		</li>
	);
};
