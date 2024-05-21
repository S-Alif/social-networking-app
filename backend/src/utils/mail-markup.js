exports.otpMail = (otp, user, text) => {
  let markup = `
    <!doctype html>
<html>
  <body>
    <div
      style='background-color:#FFFFFF;color:#03124A;font-family:Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:24px 24px 24px 24px;text-align:left">
                <img
                  alt=""
                  src="https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_RAFATLGe3CN1wDsb/birdhouse.png"
                  height="32"
                  style="height:32px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
              <div style="padding:16px 24px 16px 24px">
                <hr style="width:100%;border:none;border-top:1px solid #EEEEEE;margin:0"
                />
              </div>
              <div style="padding:8px 24px 8px 24px">
                <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:0px 0px 8px 0px"
                >
                  Hi ${user},
                </h3>
                <div style="font-size:16px;font-weight:normal;text-align:left;padding:0px 0px 16px 0px"
                >
                  ${text}. Please use the following code to
                  complete the procedure
                </div>
                <div style="padding:16px 0px 16px 0px">
                  <hr style="width:100%;border:none;border-top:1px solid #EEEEEE;margin:0"
                  />
                </div>
              </div>
              <h1 style="font-weight:bold;text-align:center;margin:0;font-size:32px;padding:16px 24px 16px 24px"
              >
                ${otp}
              </h1>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  `

  return markup
}

exports.otpMail = (user, text) => {
  let markup = `
    <!doctype html>
<html>
  <body>
    <div
      style='background-color:#FFFFFF;color:#03124A;font-family:Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:24px 24px 24px 24px;text-align:left">
                <img
                  alt=""
                  src="https://d1iiu589g39o6c.cloudfront.net/live/platforms/platform_A9wwKSL6EV6orh6f/images/wptemplateimage_RAFATLGe3CN1wDsb/birdhouse.png"
                  height="32"
                  style="height:32px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
              <div style="padding:16px 24px 16px 24px">
                <hr style="width:100%;border:none;border-top:1px solid #EEEEEE;margin:0"/>
              </div>
              <div style="padding:8px 24px 8px 24px">
                <h3 style="font-weight:bold;text-align:left;margin:0;font-size:20px;padding:0px 0px 8px 0px">
                  Hi ${user},
                </h3>
                <div style="font-size:16px;font-weight:normal;text-align:left;padding:0px 0px 16px 0px">
                  ${text}
                </div>
                <div style="padding:16px 0px 16px 0px">
                  <hr style="width:100%;border:none;border-top:1px solid #EEEEEE;margin:0"/>
                </div>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  `

  return markup
}