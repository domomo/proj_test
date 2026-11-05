import { Sparkles } from 'lucide-react'
import { useSession } from '../context'
import { Dialog } from './Dialog'
import { PreferenceForm } from './PreferenceForm'

export function SurveyDialog() {
  const s = useSession()
  return <Dialog open={s.surveyOpen} close={s.closeSurvey} title="가입 취향 설정">
    <div className="dialog-symbol"><Sparkles /></div>
    <h2>어떤 순간에 마음이 끌리나요?</h2>
    <p className="muted">좋아하는 분야를 하나 이상 골라 주세요.<br />이후에는 마이페이지의 취향 설정에서 수정할 수 있어요.</p>
    {s.surveyOpen && s.user && <PreferenceForm onSaved={s.closeSurvey} />}
  </Dialog>
}
