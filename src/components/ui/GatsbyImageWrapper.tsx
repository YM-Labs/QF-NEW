import { GatsbyImage, getImage, GatsbyImageProps } from "gatsby-plugin-image";
import * as React from "react";

export class GatsbyImageWrapper extends React.Component<{ outerWrapperClassName?: string } & GatsbyImageProps, any> {
  render() {
    const { outerWrapperClassName, image, loading, ...props } = this.props;
    // @ts-ignore
    const gatsbyImage = getImage(image);

    return (
      <div
        className={
          outerWrapperClassName
            ? outerWrapperClassName + " gatsby-image-outer-wrapper"
            : "gatsby-image-outer-wrapper"
        }
      >
        <GatsbyImage image={gatsbyImage || image} loading={loading || 'lazy'} {...props} />
      </div>
    );
  }
}