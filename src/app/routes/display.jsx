import { useActiveQuestion } from '../../features/questions/hooks/use-active-question.js'
import { useLiveResults } from '../../features/results/hooks/use-live-results.js'
import { ResultsBoard } from '../../features/results/components/results-board.jsx'
import { WaitingScreen } from '../../features/results/components/waiting-screen.jsx'
import { CenteredPage } from '../../components/layout/centered-page.jsx'

export const DisplayRoute = () => {
  const { question, options } = useActiveQuestion()
  const { counts, totalVoters } = useLiveResults(question?.id)

  return question ? (
    <CenteredPage>
      <ResultsBoard
        questionText={question.question_text}
        options={options}
        counts={counts}
        totalVoters={totalVoters}
      />
    </CenteredPage>
  ) : (
<video src="https://pub-99a37e889f9845efb74934ef2022d3a6.r2.dev/1005.mp4" autoPlay loop muted playsInline controls style={{ width: '100%' }} />  )
}
