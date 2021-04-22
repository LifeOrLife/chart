export type domType = Document | Window | HTMLElement;

/**
 * 地图数据类型
 */
export type datasource = {
	type: string;
	features: {
		type: string;
		properties: {
			[key: string]: number | string | number[];
		};
		geometry: {
			type: string;
			// coordinates: Array<Array<Array<Array<number>>>>;
			coordinates: [[[number[]]]];
		};
	}[];
};
export type features = datasource['features'];

export type point = {
	points: [number[]];
	name: string;
	center: number[];
};
