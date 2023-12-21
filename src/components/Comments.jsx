import React from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment';

const Comments = ({handleClose, ticketId}) => {
  return (
    <div className='comments-popup'>
        <div className='comments-history'>
            <div className='comment-others'>
                <p>Sample Comment here</p>
                <label>June 19, 2020 by <strong>Christian Ocon</strong></label>
            </div>

            <div className='comment-user'>
                <p>Sample Comment here</p>
                <label>June 20, 2020 by <strong>Christian Ocon</strong></label>
            </div>
        </div>
        <div className='comments-box'>
            <textarea 
                name="comment" 
                placeholder='Input your comment here...'
                id="comment-area" 
                cols="30" 
                rows="5">
            </textarea>
            <button id='post-comment'>
                <AddCommentIcon fontSize='large'/>
                Post Comment
            </button>
        </div>
    </div>
  )
}

export default Comments
