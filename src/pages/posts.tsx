import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

const fetchData = async () => {
  return await axios
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

  // post,put,delete等の変更を行う時に使う。isLoadingとかが自動でついてくる
  // これを使う1番の理由はpost等でデータ変更次にuseQueryでキャッシュしてるデータも変更したいから
  // useMutationの中の関数は後でmutateする時に実行してほしい関数だから、ここではまだ実行されてない、登録をしている
  // ここのdistructuringされているのは全てmutate関数が実行された時に動くもの
  // mutate関数を実行するときの引数がここでいうpostDataの部分（変更したいデータ）
  // 2つ目の引数はmutateが成功した時にしてしたkeyのキャッシュを無効化し、再取得する
  const { mutate, isSuccess, isError, isLoading, error } = useMutation(
    (postData) =>
      axios.post('https://jsonplaceholder.typicode.com/posts', postData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [postByIdKey] })
      },
    }
  )

  const handleOnClick = (data: any) => {
    //ここのdataが上のpostDataの部分になる
    mutate(data)
  }

  if (isLoading) return 'adding post...'
  if (isError) return 'error...'
  if (isSuccess) return 'post added!'

  return (
    <div>
      <ul>
        {query.data?.map((data: any) => (
          <li key={data.id}>
            {data.title}
            <button onClick={() => handleOnClick({ title: 'hokori' })}>
              ポスト
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Posts
