
import ScheduleSection from "../containers/videoCall/scheduleSection"
import RouterContext from "../context/RouterContext"
const CallAvailability = (props) => {
    return (
        <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
            <>
                <ScheduleSection />
            </>
        </RouterContext>
    )
}
export default CallAvailability