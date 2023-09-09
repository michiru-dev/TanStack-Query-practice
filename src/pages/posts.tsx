import { useQueryClient, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const fetchData = async () => {
  await axios
    .get('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.data)
}

//文字列を受け取り配列にして返す役目
//レスト（残余）パラメータ：...をつけることで配列にしてくれる
const decideQueryKey = (...idArr: string[]) => {
  return idArr
}

//いろんな種類のquerykeyを生成できる関数を用意する役目
const keyObj = {
  postsAll: 'postsAll',
  postsById: (id: string) => decideQueryKey('post', id),
  postsByIds: (...ids: string[]) => decideQueryKey('post', ...ids),
  //idとidsなぜ2種類作るかというと、idsだけでも動くけど1つだけしか引数を渡したくない時（それによって挙動を変えることがあるため）様に2つ用意
  //今回はそんなことはないけど例として2つ用意
}

function Posts() {
  //app.tsxで作った保管庫にアクセス可能にする
  const queryClient = useQueryClient()

  const postByIdKey = keyObj.postsById('1')

  //queryKeyは保管庫にたくさん部屋ができるからそれのアクセスキー
  //queryFnは実行するfetchやaxios
  const query = useQuery({ queryKey: [postByIdKey], queryFn: fetchData })

  return (
    <div>
      <ul>
        {query.data?.map((data: any) => (
          <li key={data.id}>{data.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default Posts
