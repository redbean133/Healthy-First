import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function BeforeAfterPage() {
    const state = useContext(GlobalState);
    const [page, setPage] = state.FacilityAPI.page;

    return (
        <div className="load_more">
            {
                page <= 1 ? "" : <button class="btn btn-light" onClick={() => setPage(page - 1)}>Trang trước</button>
            }
            {
                state.FacilityAPI.facilities[0].length < page * 30 ? "" : <button class="btn btn-light" onClick={() => setPage(page + 1)}>Trang sau</button>
            }
            
        </div>
    )
}

export default BeforeAfterPage;
