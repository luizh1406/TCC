export default function setDimensions(mobile){
  if(mobile){
    const dimensions = {
      topDiv:{
        height: 65,
      },
      loadingLabel:{
        width: '200px',
        height: '35px'
      },
      containerModel1:{
        fontSize: '7px'
      },
      trContainer:{
        marginBottom: '10px',
        marginTop: '10px',
        margin: '10px'
      },
      trBox:{
        height: '150px',
        width: '100%'
      },
      sidebarDiv:{
        width:'80px'
      },
      textDiv:{
        height: '35px',
        width: '300px',
        fontSize: '10px',
        padding: '5px'
      },
      titleGroup1:{
        width: '100%',
        fontSize: '12px',
        padding: '5px'
      },
      clientDataDiv:{
        width: '200px',
        fontSize: '10px',
        height: '35px',
        margin: '10px',
        padding: '10px',
      },
      cancelButton:{
        fontSize: '10px'
      },
      configuratorButton:{
        width: '200px',
        height: '35px',
      },
      popContainer:{
        width: '200px'
      },
      clientDataInputDiv:{
        margin: '10px',
        fontSize: '10px',
        height: '35px',
        padding: '10px'
      },
      buttonModel2:{
        width: '200px'
      },
      boxFilter:{
        height: '80px',
        fontSize: '7px',
      },
      boxFilterEl:{
        height: '40px'
      }
    }

    return dimensions
  }else{
    const dimensions = {
      loginContainer:{
        width: 500,
        height: 800,
        padding: "10px",
        margin: 0
      },
      labelModel1:{
        width: 400,
        height: 40,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      loadingLabel:{
        width: 300,
        height: 80,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      inputModel1:{
        width: 400,
        height: 40,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      containerModel1:{
        width: 300,
        height: 40,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      buttonModel1:{
        width: 10,
        height: 50,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      buttonModel2:{
        width: 300,
        height: 50,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      topDiv:{
        height: 65,
      },
      sidebarDiv:{
        height: "100%",
        widthClosed: 80,
        widthOpen: 300,
        width: '175px',
        padding: "15px",
      },
      sidebarItems:{
        width: "100%",
        height: 20,
        padding: "10px"
      },
      menuIcon:{
        height: 40,
        width: 40,
        padding: 10,
        margin: 10,
      },
      textDiv:{
        padding: "15px",
        height: "50px",
        fontSize: '20px',
      },
      logoutButton:{
        padding: "15px",
        width: "100px",
        fontSize: "20px"
      },
      titleGroup1:{
        width: 800,
        height: 40,
        padding: 2,
        fontSize: 25,
        margin: 10,
      },
      clientDataDiv:{
        width: 800,
        height: 40,
        padding: '10px',
        fontSize: 25,
        margin: "5px",        
      },
      configuratorButton:{
        width: 800,
        height: 40,
        padding: "15px",
        fontSize: 25,
        margin: 10,        
      },
      logoutButton:{
        padding: "15px",
        width: "100px",
        fontSize: "20px"
      },
      cancelButton:{
        padding: "15px",
        width: "200px",
        fontSize: "20px"
      },
      popContainer:{
        width: '600px',
        height: '800px'
      },
      trBox:{
        height: "150px",
        fontSize: '15px',
        margin: '15px'
      },
      trContainer:{
        marginBottom: "15px"
      },
      boxFilter:{
        height: '100px'
      },
      boxFilterEl:{
        height: '40px',
        fontSize: '10px',
      }
    }

    return dimensions
  }
}