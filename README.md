# Art Market

1) Should allow only creator to log in and upload content to her marketplace page. 

From create-item.js

<!-- import { useRouter } from 'next/router'
import { Link } from 'next/link'

...

export default function CreateItem({}) {
  
  const [session, loading] = useSession()
  ...  -->

From index.js

<!-- import { signIn, signOut, useSession } from "next-auth/client"

...

export default function Home() {

const [session, loading] = useSession()
...

async function buyNft(nft) {

... 

 if (loading) {
    return <p>Loading...</p>
  }

 ... -->

 Uses credentials stored in .env.local. Server-side access control not exceptionally secure. Need to base this on NFT ownership validation like BAYC.

 

2) When a user purchases an item, the purchase price will be transferred from the buyer to the seller (the artist in this case should be the only one who can create) and the item will be transferred from the marketplace to the buyer.

3) The marketplace owner will be able to set a listing fee. This fee will be taken from the seller and transferred to the contract owner upon completion of any sale, enabling the owner of the marketplace to earn recurring revenue from any sale transacted in the marketplace.

4) Users can search on the homepage by querying the GraphQL (TBD)

-----------------------------------------------------------------------------------------------------------------------------

