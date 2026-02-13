import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  'img',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'u',
  'mark',
  'span',
]

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  a: ['href', 'name', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  span: ['style'],
  p: ['style'],
  h1: ['style'],
  h2: ['style'],
  h3: ['style'],
  h4: ['style'],
  h5: ['style'],
  h6: ['style'],
  td: ['colspan', 'rowspan', 'style'],
  th: ['colspan', 'rowspan', 'style'],
}

const ALLOWED_STYLES: sanitizeHtml.IOptions['allowedStyles'] = {
  '*': {
    color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/, /^rgba\((\s*\d+\s*,){3}\s*(0|1|0?\.\d+)\s*\)$/],
    'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgb\((\s*\d+\s*,){2}\s*\d+\s*\)$/, /^rgba\((\s*\d+\s*,){3}\s*(0|1|0?\.\d+)\s*\)$/],
    'font-size': [/^\d+(px|em|rem|%)$/],
    'font-family': [/^[-\w\s"',]+$/],
    'text-align': [/^(left|right|center|justify)$/],
  },
}

export function looksLikeHtml(content?: string | null) {
  if (!content) return false
  return /<\/?[a-z][\s\S]*>/i.test(content)
}

export function sanitizeRichHtml(content?: string | null) {
  if (!content) return ''
  return sanitizeHtml(content, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  })
}

export function stripRichText(content?: string | null) {
  if (!content) return ''
  if (!looksLikeHtml(content)) {
    return content.replace(/\s+/g, ' ').trim()
  }
  return sanitizeHtml(content, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim()
}
