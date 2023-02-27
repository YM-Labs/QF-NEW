export class Rect {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
}
export class RatioUtil {
	/**
     Determines the ratio of width to height.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     */
	public static widthToHeight(size: Rect): number {
		return size.width / size.height;
	}

	/**
     Determines the ratio of height to width.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     */
	public static heightToWidth(size: Rect): number {
		return size.height / size.width;
	}

	/**
     Scales an area's width and height while preserving aspect ratio.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param amount: The decimal percentage amount you wish to scale by.
     @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
     */
	public static scale(size: Rect, amount: number, snapToPixel: boolean = true): Rect {
		return RatioUtil._defineRect(size, size.width * amount, size.height * amount, snapToPixel);
	}

	/**
     Scales the width of an area while preserving aspect ratio.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param height: The new height of the area.
     @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
     */
	public static scaleWidth(size: Rect, height: number, snapToPixel: boolean = true): Rect {
		return RatioUtil._defineRect(size, height * RatioUtil.widthToHeight(size), height, snapToPixel);
	}

	/**
     Scales the height of an area while preserving aspect ratio.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param width: The new width of the area.
     @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
     */
	public static scaleHeight(size: Rect, width: number, snapToPixel: boolean = true): Rect {
		return RatioUtil._defineRect(size, width, width * RatioUtil.heightToWidth(size), snapToPixel);
	}

	/**
     Resizes an area to fill the bounding area while preserving aspect ratio.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param bounds: The area to fill. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
     */
	public static scaleToFill(size: Rect, bounds: Rect, snapToPixel: boolean = true): Rect {
		let scaled: Rect = RatioUtil.scaleHeight(size, bounds.width, snapToPixel);

		if (scaled.height < bounds.height) {
			scaled = RatioUtil.scaleWidth(size, bounds.height, snapToPixel);
		}
		return scaled;
	}

	/**
     Resizes an area to the maximum size of a bounding area without exceeding while preserving aspect ratio.

     @param size: The area's width and height expressed as a <code>Rect</code>. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param bounds: The area the rectangle needs to fit within. The <code>Rect</code>'s <code>x</code> and <code>y</code> values are ignored.
     @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
     */
	public static scaleToFit(size: Rect, bounds: Rect, snapToPixel: boolean = true): Rect {
		let scaled: Rect = RatioUtil.scaleHeight(size, bounds.width, snapToPixel);

		if (scaled.height > bounds.height) {
			scaled = RatioUtil.scaleWidth(size, bounds.height, snapToPixel);
		}

		return scaled;
	}

	protected static _defineRect(size: Rect, width: number, height: number, snapToPixel: boolean): Rect {
		let scaled: Rect = new Rect(size.width, size.height);
		scaled.width = snapToPixel ? Math.round(width) : width;
		scaled.height = snapToPixel ? Math.round(height) : height;

		return scaled;
	}
}
