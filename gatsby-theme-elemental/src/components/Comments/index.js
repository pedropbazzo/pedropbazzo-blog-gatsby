import React from "react"
import PropTypes from "prop-types"


import * as S from "./styled"

const Comments = ({ url, title }) => {
    const completeURL = `${url}`

    return (
        <S.CommentsWrapper>
            <S.CommentsTitle>Comments</S.CommentsTitle>
            
        </S.CommentsWrapper>
    )
}

Comments.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
}

export default Comments
