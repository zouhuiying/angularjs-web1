<%String emaill=request.getParameter("email");%>
<%String passwordd=request.getParameter("password");%>
<%
request.getSession().setAttribute("email",emaill);
%>


<%
request.getSession().setAttribute("password",passwordd);
%>



<%=request.getSession().getAttribute("email")%>
<%=request.getSession().getAttribute("password")%>
<%//=request.getSession().getAttribute("yid")%>

<%@page import="java.sql.*"%>
<%
		String sqlpassword="";
		String sqlname="";
        
        Connection con = null;
        Statement st = null;
        ResultSet rs = null;
        String url = "jdbc:mysql://localhost:3306/";
        String db = "websocket1";
        String driver = "com.mysql.jdbc.Driver";
        String user = "root";
        String pass = "zouhuiying";
        try {
            Class.forName(driver);
            con = DriverManager.getConnection(url + db, user, pass);
//            con.setAutoCommit(false);                         
            st = con.createStatement();
            String sql = "select * from myapp_chatusers where email ='"+emaill+"'";
            rs = st.executeQuery(sql);
            //pre.executeUpdate();  
            System.out.println("No  \tName");
            while (rs.next()) {
                sqlname=(rs.getString("name"));
                sqlpassword=(rs.getString("password"));
            }
            rs.close();
            st.close();
            con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

%>
<%
out.print(sqlpassword+"sqlpass");
out.print(passwordd+"password");

if (sqlpassword.equals(passwordd)){
	out.print("ok");
	request.getSession().setAttribute("email",emaill);
	request.getSession().setAttribute("password",passwordd);
	request.getSession().setAttribute("name",sqlname);
//	response.sendRedirect("http://192.168.139.215:8080/demo/#/sidebarRight");
	response.sendRedirect("http://192.168.139.215:8080/demo/#/drag"+"?mid="+sqlname);
//	response.sendRedirect("http://192.168.139.215:8080/demo/#/drag?mid=");
}else{
	out.print("wrong passwrod");
	response.sendRedirect("http://192.168.139.215:8080/demo/#/forms");
}
%>
