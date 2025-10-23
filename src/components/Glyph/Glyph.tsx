import { GLYPHS } from './glyphs'

export type GlyphName = keyof typeof GLYPHS

type GlyphProps = React.SVGProps<SVGSVGElement> & {
  name: GlyphName
  fill?: string
  size?: number | string
  width?: number | string
  height?: number | string
}

export function Glyph(props: GlyphProps) {
  const { name, fill, size = 24, width, height, className } = props

  const glyph = GLYPHS[name]

  if (!glyph) return null

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width || size}
      height={height || size}
      viewBox={glyph.viewBox}
      fill={fill}
      className={className}
    >
      <path d={glyph.path}></path>
    </svg>
  )
}
