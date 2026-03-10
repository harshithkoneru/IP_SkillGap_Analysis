
<%@ page import="java.sql.*" %>
<%
String url="jdbc:mysql://localhost:3306/skill_assessment";
String user="root";
String password="password";
Class.forName("com.mysql.cj.jdbc.Driver");
Connection conn=DriverManager.getConnection(url,user,password);
%>
