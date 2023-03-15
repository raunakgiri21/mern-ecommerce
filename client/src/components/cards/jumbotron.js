import React from 'react'

const jumbotron = (props) => {
    return(
        <div className='container-fluid bg-primary'>
            <div className='row'>
                <div className='col text-center p-5' style={{backgroundColor: '#ADD8E6'}}>
                    <h1>{props.pageTitle}</h1>
                    <p className='lead'>{props.pageSubtitle}</p>
                </div>
            </div>
        </div>
    )
}

export default jumbotron