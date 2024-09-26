import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { FacetSlider, FacetGridOptions, FacetPaletteOptions, FacetHierarchyOptions, withController } from '@searchspring/snap-preact-components';
import { useEffect, useState } from 'preact/hooks';

export const CustomFacets = withController(
	observer((props) => {
		const { facets } = props.controller.store;

		return (
			facets.length !== 0 && (
				<div className="ss__facets">
					{facets.map((facet) => (
						<CustomFacet facet={facet} fisrtElement={facets[0]} />
					))}
				</div>
			)
		);
	})
);

export const CustomFacet = withController(
	observer((props) => {
		const { facet, fisrtElement } = props;
		const [minPrice, setMinPrice] = useState(0);
		const [maxPrice, setMaxPrice] = useState(0);
		const [isFilterOpen, setIsFilterOpen] = useState({ label: facet.label, value: fisrtElement.label === facet.label ? true : false });

		useEffect(() => {
			if (facet.label === "Price") {
				const element = document.querySelectorAll(".ss__facet-slider__label");
				setMinPrice(element[0].textContent.split(".")[0]);
				setMaxPrice(element[1].textContent.split(".")[0]);
				element.forEach(label => label.style.display = 'none');
			}
		});

		return (<>
			<div className={`ss__facet ${isFilterOpen.value ? "open" : ""}`} >
				<form class="filter-form">
					<h5
						className="ss__facet__header"
						onClick={() => {
							facet.toggleCollapse();
							setIsFilterOpen((prev) => ({ label: facet.label, value: !prev.value }));
						}}
					>
						{facet.label}
					</h5>
					<div className={`ss__facet--field-${facet.field} ss__facet--display-${facet.display} ${facet.collapsed ? 'ss__facet--collapsed' : ''}`}>
						<div className="collapsible-content__inner ss__facet-options">
							{facet.label === 'Color' ? <>
								<div
									id="SidebarDrawer-2-filter-color"
									class="collapsible-content collapsible-content--sidebar is-open"
									data-collapsible-id="filter-color"
									style="height: auto;"
								>
									<div class="collapsible-content__inner">
										<ul class="no-bullets tag-list">
											{facet.values?.map((color) => (
												<li class="tag tag--swatch" {...color.url.link}>
													<label class="tag__checkbox-wrapper text-label">
														<input type="checkbox" class="tag__input" name="filter.v.option.color" value={color.value} />
														<span
															class={`color-swatch color-swatch--filter color-swatch--${color.value}`}
															title={color.value}
															style={`background-image: url(https://www.mezlanwarehouse.com/cdn/shop/files/${color.value
																.toLowerCase()
																.replace(/[^a-zA-Z ]/g, '-')}.png)`}
														>
															{color.value}
														</span>
													</label>
												</li>
											))}
										</ul>
									</div>
								</div>
							</> : <>
								{{
									grid: <FacetGridOptions values={facet.values} />,
									palette: <FacetPaletteOptions values={facet.values} />,
									hierarchy: <FacetHierarchyOptions values={facet.values} />,
									slider: <div><FacetSlider facet={facet} />
										<div className='ss-price-fit'>
											<span className='ss-minPrice'>{minPrice}</span>
											<span className='ss-price-highpan'>-</span>
											<span className='ss-maxPrice'>{maxPrice}</span>
										</div>
									</div>,
								}[facet.display] || <CustomFacetOptionsList facet={facet} />}
							</>
							}
						</div>
					</div>
				</form>
			</div>
		</>
		);
	})
);

const CustomFacetOptionsList = observer((props) => {
	const facet = props.facet;
	const values = facet.refinedValues;
	const [isShowMore, setIsShowMore] = useState(false);

	return (<>
		<ul className="ss__facet-options-list">
			{values?.map((value, index) => {
				return (
					isShowMore || index <= 3 ? <li className={`ss__facet-options-list__option ${value.filtered ? 'ss__facet-options-list__option--active' : ''}`}>
						<a {...value.url.link} title={`Remove filter ${value.label}`}>
							<span className='filter-label'>{value.label}</span>
							<small className='facets-count'>({value.count})</small>
						</a>
					</li> : null
				);
			})}
		</ul>
		{values.length > 4 ? <div class="show-more-button fs-result-page-qcwso2">
			<span onClick={() => setIsShowMore((prev) => !prev)} class="show-more-button-text fs-result-page-qcwso2">
				{isShowMore ? "Show Less -" : "Show More +"}
			</span>
		</div> : null}
	</>
	);
});
