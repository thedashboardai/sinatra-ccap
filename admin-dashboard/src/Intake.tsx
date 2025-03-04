import React, {useEffect} from "react";

export default function Intake() {

    useEffect(() => {
        //@ts-ignore
        Tally.loadEmbeds()
    }, [])

    return (
        <div style={{display: 'flex', maxHeight: '100vh', flexDirection: 'column', height: '100%'}}>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
            />
            <title>{'Welcome to C-CAP!'}</title>
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html:
                    "\n      html { margin: 0; height: 100%; overflow: hidden; }\n      iframe { position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: 0; }\n    "
                }}
            />
            <iframe
                data-tally-src="https://tally.so/r/mYddDq?transparentBackground=1"
                width="100%"
                height="100%"
                title="Welcome to C-CAP!"
            />
        </div>
    )
}
