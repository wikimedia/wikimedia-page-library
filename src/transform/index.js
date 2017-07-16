import CollapseTable from './CollapseTable'
import CompatibilityTransform from './CompatibilityTransform'
import ElementGeometry from './ElementGeometry'
import ElementUtilities from './ElementUtilities'
import LazyLoadTransform from './LazyLoadTransform'
import LazyLoadTransformer from './LazyLoadTransformer'
import Polyfill from './Polyfill'
import RedLinks from './RedLinks'
import ThemeTransform from './ThemeTransform'
import Throttle from './Throttle'
import WidenImage from './WidenImage'

export default {
  CollapseTable,
  CompatibilityTransform,
  LazyLoadTransform,
  LazyLoadTransformer,
  RedLinks,
  ThemeTransform,
  WidenImage,
  test: {
    ElementGeometry, ElementUtilities, Polyfill, Throttle
  }
}