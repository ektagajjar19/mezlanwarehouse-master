/* searchspring imports */
import { Snap } from '@searchspring/snap-preact';
import { getContext } from '@searchspring/snap-toolbox';

/* local imports */
import { plugin } from './scripts/plugin';
import './styles/custom.scss';

/*
	context and background filtering
 */

const context = getContext(['collection', 'shopper', 'metaImagesAndVideos']);

let backgroundFilters = [];
if (context.collection?.handle) {
	backgroundFilters.push({
		field: 'collection_handle',
		value: context.collection.handle,
		type: 'value',
		background: true,
		metaImagesAndVideos: context.metaImagesAndVideos,
	}); 
}

// const collectionFilter = {
// 	field: 'collection_handle',
// 	value: 'exotics',
// 	type: 'value',
// 	background: true,
// 	metaImagesAndVideos: context.metaImagesAndVideos,
// };
// backgroundFilters.push(collectionFilter);
 
/*
	configuration and instantiation
 */

const config = {
	context,
	features: {
		integratedSpellCorrection: {
			enabled: true,
		},
	},
	url: {
		parameters: {
			core: {
				query: { name: 'q' },
			},
		},
	},
	client: {
		globals: {
			siteId: 'x585vl',
		},
	},
	instantiators: {
		recommendation: {
			components: {
				Default: async () => {
					return (await import('./components/Recommendations/Recs')).Recs;
				},
			},
			config: {
				branch: BRANCHNAME || 'production',
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					settings: {
						infinite: {
							backfill: 5,
						},
					},
					plugins: [[plugin]],
					globals: {
						filters: backgroundFilters,
						pagination: {
							pageSize: 24,
						},
					},
				},
				targeters: [
					{
						selector: '#searchspring-sidebar',
						component: async () => {
							return (await import('./components/Sidebar')).Sidebar;
						},
						hideTarget: true,
					},
					{
						selector: '#searchspring-content',
						component: async () => {
							return (await import('./components/Content')).Content;
						},
						hideTarget: true,
					},
					{
						selector: '#searchspring-header',
						component: async () => {
							return (await import('./components/SearchHeader')).SearchHeader;
						},
						hideTarget: true,
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: '#search-input',
				},
				globals: {
					pagination: {
						pageSize: 6,
					},
				},
				targeters: [
					{
						selector: '#searchspring-input',
						component: async () => {
							return (await import('./components/Autocomplete')).Autocomplete;
						},
					},
				],
			},
		],
		recommendation: [
			{
				config: {
					id: 'recommendation',
					tag: 'no-results',
					branch: BRANCHNAME || 'production',
				},
				targeters: [
					{
						selector: '#searchspring-recommendation',
						component: async () => {
							return (await import('./components/Recommendations/Recs')).Recs;
						},
					},
					{
						selector: '#searchspring-recs-minicart',
						component: async () => {
							return (await import('./components/Recommendations/Recs')).Recs;
						},
					},
				],
			},
		],
	},
};

const snap = new Snap(config);
