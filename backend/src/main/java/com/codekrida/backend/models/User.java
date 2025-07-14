
package com.codekrida.backend.models;


import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Builder
@Data
@Document
public class User implements UserDetails{
  @Id
  private String id;
  @NonNull
  private String name;
  @NonNull
  private String password;
  @Indexed(unique = true)
  private String email;
  private  final Role role = Role.USER;
  private Date registeredAt;
  private String workspaceName;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @Override
  public @NonNull String getPassword() {
    return password;

  }

  @Override
  public String getUsername() {
    return email;
  }
}
