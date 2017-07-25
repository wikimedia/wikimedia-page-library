import CollapseTable from './CollapseTable'
import CompatibilityTransform from './CompatibilityTransform'
import DimImagesTransform from './DimImagesTransform'
import EditTransform from './EditTransform'
import ElementGeometry from './ElementGeometry'
import ElementUtilities from './ElementUtilities'
import FooterContainer from './FooterContainer'
import FooterLegal from './FooterLegal'
import FooterMenu from './FooterMenu'
import FooterReadMore from './FooterReadMore'
import FooterTransformer from './FooterTransformer'
import LazyLoadTransform from './LazyLoadTransform'
import LazyLoadTransformer from './LazyLoadTransformer'
import PlatformTransform from './PlatformTransform'
import Polyfill from './Polyfill'
import RedLinks from './RedLinks'
import ThemeTransform from './ThemeTransform'
import Throttle from './Throttle'
import WidenImage from './WidenImage'

export default {
  // todo: rename CollapseTableTransform.
  CollapseTable,
  CompatibilityTransform,
  DimImagesTransform,
  EditTransform,
  // todo: rename Footer.ContainerTransform, Footer.LegalTransform, Footer.MenuTransform,
  //       Footer.ReadMoreTransform.
  FooterContainer,
  FooterLegal,
  FooterMenu,
  FooterReadMore,
  FooterTransformer,
  LazyLoadTransform,
  LazyLoadTransformer,
  PlatformTransform,
  // todo: rename RedLinkTransform.
  RedLinks,
  ThemeTransform,
  // todo: rename WidenImageTransform.
  WidenImage,
  test: {
    ElementGeometry,
    ElementUtilities,
    Polyfill,
    Throttle
  }
}