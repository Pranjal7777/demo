import isMobile from "../../hooks/isMobile";

export const PlusIcon = ({ handleOnClick }) => {
    const [mobileView] = isMobile()
    return (
        <div className="contentBox d-flex justify-content-center align-items-center cursorPtr" onClick={handleOnClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5C18.3513 0.5 23.5 5.64873 23.5 12Z" stroke="url(#paint0_linear_2492_416123)" />
                <path d="M11.9979 15.82C11.7719 15.82 11.5888 15.6368 11.5888 15.4109V12.4109H8.58878C8.36284 12.4109 8.17969 12.2277 8.17969 12.0018C8.17969 11.7758 8.36284 11.5927 8.58878 11.5927H11.5888V8.59268C11.5888 8.36675 11.7719 8.18359 11.9979 8.18359C12.2238 8.18359 12.407 8.36675 12.407 8.59268V11.5927H15.407C15.6329 11.5927 15.8161 11.7758 15.8161 12.0018C15.8161 12.2277 15.6329 12.4109 15.407 12.4109H12.407V15.4109C12.407 15.6368 12.2238 15.82 11.9979 15.82Z" fill="url(#paint1_linear_2492_416123)" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.58878 12.4109C8.36284 12.4109 8.17969 12.2277 8.17969 12.0018C8.17969 11.7758 8.36284 11.5927 8.58878 11.5927H11.5888V8.59268C11.5888 8.36675 11.7719 8.18359 11.9979 8.18359C12.2238 8.18359 12.407 8.36675 12.407 8.59268V11.5927H15.407C15.6329 11.5927 15.8161 11.7758 15.8161 12.0018C15.8161 12.2277 15.6329 12.4109 15.407 12.4109H12.407V15.4109C12.407 15.6368 12.2238 15.82 11.9979 15.82C11.7719 15.82 11.5888 15.6368 11.5888 15.4109V12.4109H8.58878ZM11.2138 12.7859H8.58878C8.15574 12.7859 7.80469 12.4348 7.80469 12.0018C7.80469 11.5687 8.15574 11.2177 8.58878 11.2177H11.2138V8.59268C11.2138 8.15964 11.5648 7.80859 11.9979 7.80859C12.4309 7.80859 12.782 8.15964 12.782 8.59268V11.2177H15.407C15.84 11.2177 16.1911 11.5687 16.1911 12.0018C16.1911 12.4348 15.84 12.7859 15.407 12.7859H12.782V15.4109C12.782 15.8439 12.4309 16.195 11.9979 16.195C11.5648 16.195 11.2138 15.8439 11.2138 15.4109V12.7859Z" fill="url(#paint2_linear_2492_416123)" />
                <defs>
                    <linearGradient id="paint0_linear_2492_416123" x1="24" y1="24" x2="-2.48691" y2="20.8391" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#D33AFF" />
                        <stop offset="1" stop-color="#FF71A4" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_2492_416123" x1="8.17969" y1="8.18359" x2="16.6073" y2="9.18934" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#D33AFF" />
                        <stop offset="1" stop-color="#FF71A4" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_2492_416123" x1="7.80469" y1="7.80859" x2="17.0601" y2="8.91312" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#D33AFF" />
                        <stop offset="1" stop-color="#FF71A4" />
                    </linearGradient>
                </defs>
            </svg>
            <style jsx>
                {
                    `
                    .contentBox {
                        width: ${mobileView ? '90px' : '120px'};
                        height:${mobileView ? '90px' : '120px'};
                        border-radius: 12px;
                        background: var(--l_app_bg2);
                        flex: 0 0 auto;
                    }
                    `
                }
            </style>
        </div>
    );
};