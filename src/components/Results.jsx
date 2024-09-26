import { h, Fragment } from 'preact';
import { observer } from 'mobx-react';
import { Price, InlineBanner, withController } from '@searchspring/snap-preact-components';
import { useEffect, useState } from 'preact/hooks';

export const Results = withController(
	observer((props) => {
		const controller = props.controller;
		const { results } = controller.store;

		return (
			<div id="products-grid"
				class="products-grid fs-result-page-158897m"
				style="--grid-template-columns: repeat(3, calc(33.333333333333336% - 5px)); --grid-row-gap: 5px; --grid-col-gap: 5px; --grid-left-margin: 5px; position: relative;">
				{results.map((result) => (
					<div key={result.id}
						class="product-card fs-results-product-card fs-product-card fs-result-page-17x79ur product-card-border fs-product-has-compare-price fs-product-has-compare"
						style="--product-padding:3px;--product-border:unset;--product-border-hover:undefined;--product-border-radius:11%;--product-shadow:unset;--product-info-grid-areas:&quot;title title title title&quot; &quot;compare compare price price&quot; &quot;colorSwatches colorSwatches colorSwatches colorSwatches&quot; ;--product-info-padding:3px;--add-to-cart-opacity:1;--add-to-cart-opacity-hover:1;--items-wrapper-justify-content:"
						data-product-id="8377831293096"
						data-product-position="1"
						aria-labelledby="fs-product-8377831293096-0 fs-product-8377831293096-1 fs-product-8377831293096-2"
					>
						{{
							banner: <InlineBanner banner={result} />,
						}[result.type] || <Result result={result} />}
					</div>
				))}
			</div>
		);
	})
);

const Result = withController(
	observer((props) => {
		const { result, controller } = props;
		const {
			attributes,
			mappings: { core },
		} = result;

		const colors = attributes.ss_swatches ? JSON.parse(attributes.ss_swatches) : [];
		const ssTags = attributes.ss_tags ? attributes.ss_tags[Object.getOwnPropertySymbols(attributes.ss_tags)[0]].values_ : [];
		const intellisuggest = (e) => controller.track.product.click(e, result);
		const [productImage, setProductImage] = useState({ color: "", url: core.imageUrl });
		const [extendedSizeWidthTag, setExtendedSizeWidthTag] = useState(null);
		const [limitedTimePriceTag, setLimitedTimePriceTag] = useState(null);
		const spgTag = attributes.tags.find((tag) => tag.includes("SPG-"));
		const spgTagCount = spgTag?.split("-").pop();

		const calculateDiscountPercentage = (actualPrice, offerPrice) => {
			if (actualPrice <= 0 || offerPrice <= 0) {
				return "Error: Prices must be positive numbers.";
			}

			const discountAmount = actualPrice - offerPrice;

			const discountPercentage = (discountAmount / actualPrice) * 100;
			return discountPercentage.toFixed(0) + "%";
		}

		const calculateDiscountPrice = (actualPrice, percentage) => {
			if (actualPrice <= 0 || percentage <= 0) {
				return "Error: Price and percentage must be positive numbers.";
			}

			const discountAmount = (actualPrice * percentage) / 100;
			return actualPrice - discountAmount;
		}

		const handleChangeProductColor = (color) => {
			const imagesJSON = JSON.parse(attributes.variant_images_json);
			const selectedImage = imagesJSON.find((imgData) => imgData.color === color);
			setProductImage({ color: selectedImage.color, url: selectedImage.img });
		}

		useEffect(() => {
			const metafieldsData = JSON.parse(attributes.metafields);
			const extendedSizeWidth = metafieldsData.find((metaField) => metaField.key === "extended_size_width_tag");
			setExtendedSizeWidthTag(extendedSizeWidth);
			const limitedTimePrice = metafieldsData.find((metaField) => metaField.key === "limited_time_price_tag");
			setLimitedTimePriceTag(limitedTimePrice);
		}, [])

		return (
			result && (<>
				<div class="product-card-items-wrapper fs-result-page-17x79ur">
					<div class="image-wrapper fs-serp-image-wrapper fs-result-page-17x79ur">
						<div class="fs-badges-wrapper fs-result-page-1hblk7n">
							{ssTags.includes("justin") ? <div class="product-badge-test">
								just in
							</div> : null}
							{ssTags.includes("webexclusive") ? <span class="fs_product_image_badge_Web Exclusive fs-result-page-1hblk7n">
								<img
									src="https://cdn.shopify.com/s/files/1/0470/2306/3208/t/84/assets/new-web-exclusive-icon1.png?v=158720744754320665741671629466"
									alt="" class="fs-image-badge fs-result-page-1hblk7n" />
							</span> : null}
							<div class="fs-empty-sale-badge">
							</div>
						</div>
						<a
							class="fs-product-main-image-wrapper product-image fs-result-page-kqhmwl"
							href={core.url}
							onClick={intellisuggest}
							aria-labelledby="fs-product-8377831293096-0 fs-product-8377831293096-1 fs-product-8377831293096-2">
							<div
								class="image-container fs-result-page-kqhmwl"
								style="--image-aspect-ratio:1.3333333333333333;--image-object-fit:contain">
								<img class="image fs-result-page-kqhmwl"
									alt="Hybrid Leather Sneaker"
									src={productImage.url}
									fetchpriority="high"
									loading="eager" />
							</div>
						</a>
					</div>
					<div class="info-container fs-serp-info fs-result-page-17x79ur">
						<div class="color-swatches-wrapper fs-serp-swatches fs-result-page-1xgbzd0">
							<div class="color-swatches fs-result-page-1xgbzd0">
								{colors.length > 1 ? colors.map((color) => {
									return <span onMouseEnter={() => handleChangeProductColor(color.color)} class={`color-swatch-container fs-color-swatch-container ${productImage.color === color.color ? "selected" : ""}`}>
										<span class="color-swatch fast-swatch-color-fallback fs-result-page-rybz61"
											style={{
												backgroundImage: `url(https://cdn.shopify.com/s/files/1/0470/2306/3208/files/${color.color.toLowerCase().replace(/[^a-zA-Z ]/g, '-').replace(" ", "-")}.png)`,
												backgroundColor: color.color,
												width: "25px",
												height: "25px",
											}}
											data-disabled="false">
											{color.available < 1 ? <span class="ban fs-result-page-rybz61">
												<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill:#ccc">
													<path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zM103.265 408.735c-80.622-80.622-84.149-208.957-10.9-293.743l304.644 304.643c-84.804 73.264-213.138 69.706-293.744-10.9zm316.37-11.727L114.992 92.365c84.804-73.263 213.137-69.705 293.743 10.9 80.622 80.621 84.149 208.957 10.9 293.743z">
													</path>
												</svg>
											</span> : null}
											<div class="fs-serp-tooltip"
												style="border: 1px solid black; box-shadow: black 1px 1px 1px; background: black; border-radius: 4px; padding: 4px; font-size: 12px; position: absolute; top: 31px; left: 21px; color: white; z-index: 10000000; min-width: 62px;">
												{color.color} {color.available < 1 ? "(Out of Stock)" : ""}
											</div>
										</span>
										<span class="color-swatch-color-name fs-color-name fs-result-page-rybz61">
											{color.color}
										</span>
									</span>
								}) : null}
							</div>
						</div>
						<a href={core.url} class="title-container fs-serp-product-title fs-result-page-mihllj"
							style="--title-line-clamp:1;--title-font-weight:600;--title-text-align:center;--title-font-family:&quot;Harmonia Sans&quot;, sans-serif;--title-font-size:17px;--title-letter-spacing:0.25px;--title-line-height:1.5;--title-color:#000000">
							<div class="title-wrapper fs-product-title-wrapper fs-result-page-mihllj">
								<span class="title fs-product-title fs-result-page-mihllj" id="fs-product-8377831293096-0"
									aria-label="Hybrid Leather Sneaker">
									<span class="product-title-search-term fs-product-title-search-term">
									</span>
									{core.name}
								</span>
							</div>
						</a>
						<div id="fs-product-8377831293096-1"
							class="price-container fs-serp-price fs-result-page-1a37dw5"
							style="--price-font-weight:400;--price-text-align:left;--price-font-family:&quot;Harmonia Sans&quot;, sans-serif;--price-font-size:16px;--price-letter-spacing:0.25px;--price-line-height:auto;--price-color:#242427"
							aria-label="; regular price: $189.90">
							<div class="price fs-result-page-1a37dw5">
								<Price value={spgTagCount ? calculateDiscountPrice(core.price, spgTagCount) : core.price} />
							</div>
						</div>
						<div id="fs-product-8377831293096-2"
							class="compare-container fs-result-page-8m4al0"
							style="--compare-font-weight:400;--compare-text-align:right;--compare-font-family:&quot;Harmonia Sans&quot;, sans-serif;--compare-font-size:13px;--compare-letter-spacing:0.25px;--compare-line-height:auto;--compare-color:#5e5b64">
							<div class="compare fs-compare fs-result-page-8m4al0"
								aria-label="; sale price: $275.00">
								{(core.msrp && core.price !== core.msrp) || spgTagCount ? <Price value={spgTagCount ? core.price : core.msrp} /> : null}
							</div>
						</div>
						<div class="my-promo-labels">{
							spgTagCount ? `(${spgTagCount}% OFF)` :
								core.msrp && calculateDiscountPercentage(core.msrp, core.price) !== "0%"
									? `(${calculateDiscountPercentage(core.msrp, core.price)} OFF)`
									: null
						}</div>
						{limitedTimePriceTag ? <div class="my-limitedtime-labels">{limitedTimePriceTag.value}</div> : null}
						{extendedSizeWidthTag ? <div class="my-size-labels">{extendedSizeWidthTag.value}</div> : null}
					</div>
				</div>
			</>
			)
		);
	})
);

export const NoResults = withController(
	observer((props) => {
		const controller = props.controller;
		const store = controller.store;
		const dym = store.search.didYouMean;
		const contactEmail = 'contact@thesite.com';

		return (
			<div className="ss__no-results">
				<div className="ss__no-results__container">
					{dym && (
						<p className="ss__did-you-mean">
							Did you mean <a href={dym.url.href}>{dym.string}</a>?
						</p>
					)}
				</div>
			</div>
		);
	})
);
