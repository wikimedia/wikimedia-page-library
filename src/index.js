// This file exists for CSS packaging only. It imports the override CSS
// JavaScript index file, which also exists only for packaging, as well as the
// real JavaScript, transform/index, it simply re-exports.

import './override/index'
import pagelib from './transform/index'

export default pagelib