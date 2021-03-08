import NextAuth from "next-auth"
import Providers from "next-auth/providers"


const isCorrectCredentials = credentials =>
  credentials.username === process.env.NEXTAUTH_USERNAME &&
  credentials.password === process.env.NEXTAUTH_PASSWORD

const options = {
  // Configure one or more authentication providers
  site: https://619a58e6a6a1010007e94a1e--admiring-mestorf-0150d6.netlify.app/,
  providers: [
    Providers.Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async credentials => {
        if (isCorrectCredentials(credentials)) {
          const user = { id: 1, name: "Jaleh" }
          // Any object returned will be saved in `user` property of the JWT
          return Promise.resolve(user)
        } else {
          // If you return null or false then the credentials will be rejected
          return Promise.resolve(null)
          // You can also Reject this callback with an Error or with a URL:
          // return Promise.reject(new Error('error message')) // Redirect to error page
          // return Promise.reject('/path/to/redirect')        // Redirect to a URL
        }
      },
    }),
  ],
}

export default (req, res) => NextAuth(req, res, options)
