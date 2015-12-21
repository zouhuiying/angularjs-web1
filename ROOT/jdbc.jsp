<%@page import="java.sql.*"%>
<%
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
           // con.setAutoCommit(false);// Disables auto-commit.  
            st = con.createStatement();  
           // String sql = "insert into myapp_chatusers(name,online,email,password) VAlUES('nono','true','1138377682@qq.com','woaizouhuiying')";  
            //PreparedStatement   pre = con.prepareStatement(sql);   
            String sql = "select * from myapp_chatusers where name='zouhuiying'";  
            rs = st.executeQuery(sql);  
            //pre.executeUpdate();  
            System.out.println("No  \tName");  
            while (rs.next()) {  
                out.print(rs.getString("name") + "   \t");  
                out.print(rs.getString("email") + "   \t");  
                out.print(rs.getString("password") + "   \t");  
              //  out.print(rs.getString(4) + "   \t");  
               // out.print(rs.getString(5) + "   \t");  
            }  
            rs.close();  
            st.close();  
            con.close();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  

%>
