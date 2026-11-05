import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { api } from '../api/client'
import { useSession } from '../context'
import { CATEGORIES } from '../types'
import type { User } from '../types'

const TAGS = ['현대미술', '사진', '디자인', '몰입형', '클래식', '재즈', '인디', '이야기', '가족', '야외']

export function PreferenceForm({ onSaved }: { onSaved?: () => void }) {
  const s = useSession()
  const [categories, setCategories] = useState<string[]>(s.user?.categories || [])
  const [tags, setTags] = useState<string[]>(s.user?.tags || [])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const toggle = (value: string, list: string[], setter: (values: string[]) => void) => setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value])

  return <form className="preference-form" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setError('')
    try {
      s.updateUser(await api<User>('/surveys/me', { method: 'PUT', body: JSON.stringify({ categories, tags }) }))
      s.refresh(); s.toast('취향을 저장했어요. 추천에 반영됩니다.'); onSaved?.()
    } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }}>
    <fieldset disabled={busy}><legend>좋아하는 문화 <span className="muted small">하나 이상 선택</span></legend>
      <div className="choice-grid">{CATEGORIES.map(c => <button type="button" key={c} aria-pressed={categories.includes(c)} className={categories.includes(c) ? 'choice selected' : 'choice'} onClick={() => toggle(c, categories, setCategories)}>{c}{categories.includes(c) && <Check size={16} />}</button>)}</div>
    </fieldset>
    <fieldset disabled={busy}><legend>더 끌리는 키워드 <span className="muted small">선택</span></legend>
      <div className="tag-choices">{TAGS.map(t => <button type="button" key={t} aria-pressed={tags.includes(t)} className={tags.includes(t) ? 'tag selected' : 'tag'} disabled={!tags.includes(t) && tags.length >= 10} onClick={() => toggle(t, tags, setTags)}>#{t}</button>)}</div>
    </fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button primary" disabled={!categories.length || busy}>{busy ? '저장 중…' : '취향 저장하기'}<Sparkles size={17} /></button>
  </form>
}
