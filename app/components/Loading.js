import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  }
}

export default function Loading ({speed = 300, text = 'Loading'}) {
  const [content, setContent] = React.useState(text);
  const intervalRef = React.useRef();

  React.useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setContent(content => content === `${text}...` ? text : `${content}.`)
    }, speed);

    return () => window.clearInterval(intervalRef.current)
  },[speed, text])

  
  return (
    <p style={styles.content}>
      {content}
    </p>
  )
  
}

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number
};