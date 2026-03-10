
<%@ page import="java.sql.*" %>
<%@ include file="../WEB-INF/db.jsp" %>
<%
String username=request.getParameter("username");
String password=request.getParameter("password");

PreparedStatement ps=conn.prepareStatement("SELECT * FROM instructors WHERE username=? AND password=?");
ps.setString(1,username);
ps.setString(2,password);
ResultSet rs=ps.executeQuery();

boolean ok=rs.next();
out.print("{\"success\":"+ok+"}");
conn.close();
%>
