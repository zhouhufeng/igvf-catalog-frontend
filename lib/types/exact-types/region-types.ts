
type BaseCoords = `${number}:${number}-${number}`;
export type GenomicCoordinates = BaseCoords | `chr${BaseCoords}`;
