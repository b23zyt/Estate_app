//import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

//show loading using suspense

function ListPage() {
  const data = useLoaderData();

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
          <Suspense fallback={<p>Loading the Posts...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={
                <p>Error Loading Posts!</p>
              }
            >
              {(postResponse) => postResponse.data.map(post=>(
                <Card key={post.id} item={post} />
              ))
              }
            </Await>
          </Suspense>
      </div>
    </div>
    <div className="mapContainer">
    <Suspense fallback={<p>Loading the Map</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={
                <p>Error loading Map!</p>
              }
            >
              {(postResponse) => <Map items={postResponse.data}/>}
            </Await>
          </Suspense>
    </div>
  </div>;
}

export default ListPage;
