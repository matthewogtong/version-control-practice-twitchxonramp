import { useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setTime, leaveZone, completeZone, enterZone, openModal } from "../../redux/user"

const Timer = () => {
  const currentZone = useSelector(
    (state) => state.user.entities[0].zones.slice(-1)[0]
  )

  const dispatch = useDispatch()
  let interval = useRef()

  const userId = useSelector((state) => state.user.entities[0].id)

  const add = currentZone.totalObjectiveTime * 60000
  const showHours = useSelector((state) => state.user.time.timerHours)
  const showMinutes = useSelector((state) => state.user.time.timerMinutes)
  const showSeconds = useSelector((state) => state.user.time.timerSeconds)

  const isInZone = useSelector((state) => state.user.inZone)

  const startTimer = () => {
    const countdownDate = new Date().getTime() + add

    interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = countdownDate - now

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      const timeArr = [hours, minutes, seconds]
      if (distance < 0) {
        dispatch(leaveZone())
        clearInterval(interval)
        fetch(`http://localhost:3001/users/${userId}/zones/${currentZone.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            isActive: false,
            isComplete: true,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
              dispatch(completeZone(data))
              dispatch(openModal())
          })
      } else {
        dispatch(setTime(timeArr))
      }
    }, 1000)
  }

  const safeEnterZone = useCallback(() => {
    dispatch(enterZone())
  }, [dispatch])

  useEffect(() => {
    if (!isInZone && currentZone.isActive) {
      safeEnterZone()
      startTimer()
    }
  }, [])

  return (
    <section className="timer-container">
      <section className="timer">
        <div>
          <section>
            <p>{showHours}</p>
            <p>
              <small>Hours</small>
            </p>
          </section>
          <span>:</span>
          <section>
            <p>{showMinutes}</p>
            <p>
              <small>Minutes</small>
            </p>
          </section>
          <span>:</span>
          <section>
            <p>{showSeconds}</p>
            <p>
              <small>Seconds</small>
            </p>
          </section>
        </div>
      </section>
    </section>
  );
}

export default Timer