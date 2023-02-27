import { useStaticQuery, graphql } from "gatsby"

export const PlaceHolderImage = () => {
    const data = useStaticQuery(
        graphql`
            query placeHolderImageQuery {
                contentfulAsset(title: {eq: "qfbrowsenews"}) {
                    contentful_id
                    title
                    gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
                }
            }
        `)
    return data
};
